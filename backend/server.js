// ─── SAP Sage Backend ────────────────────────────────────────────────────────
// Node.js + Express + PostgreSQL + Anthropic Claude
// Loads .env from parent directory
// ─────────────────────────────────────────────────────────────────────────────

require("dotenv").config({ path: "../.env" });

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    "http://localhost:5173",
    process.env.VITE_API_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g. curl, Postman)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));

// ─── PostgreSQL Pool ──────────────────────────────────────────────────────────
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// ─── DB Initialisation ────────────────────────────────────────────────────────
async function initDB() {
    const client = await pool.connect();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title       TEXT,
        sap_context JSONB,
        created_at  TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS messages (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
        role       TEXT,
        content    TEXT,
        tool_calls JSONB,
        citations  JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS knowledge_cache (
        id         SERIAL PRIMARY KEY,
        topic      TEXT,
        content    TEXT,
        source_url TEXT,
        source     TEXT,
        fetched_at TIMESTAMP DEFAULT NOW()
      );
    `);
        console.log("✅ Database tables ready.");
    } finally {
        client.release();
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a Basic-auth header value */
function basicAuth(user, pass) {
    return "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
}

/** Scan reply for unconfirmed BAPI / FM references */
function antiHallucinationScan(text) {
    const pattern = /\b(BAPI_[A-Z0-9_]+|FM_[A-Z0-9_]+)\b/g;
    if (pattern.test(text)) {
        return (
            text +
            "\n\n> ⚠️ **Note:** One or more BAPI / Function Module references above have not been verified against live system data. " +
            "(verify in system — unconfirmed against live data)"
        );
    }
    return text;
}

// ─── Tool Implementations ────────────────────────────────────────────────────

/**
 * Tool 1 — sap_help_search
 * Queries the SAP Help Portal search API.
 */
async function sapHelpSearch({ query }) {
    try {
        const url = `https://help.sap.com/search?q=${encodeURIComponent(query)}&locale=en-US&version=CLOUD&state=PRODUCTION`;
        const res = await fetch(url, {
            headers: { Accept: "application/json" },
            timeout: 10000,
        });
        if (!res.ok) throw new Error(`SAP Help returned ${res.status}`);
        const data = await res.json();
        const hits = (data.hits || []).slice(0, 5).map((h) => ({
            title: h.title,
            url: h.url,
            excerpt: h.excerpt || h.description || "",
        }));
        return { results: hits, query };
    } catch (err) {
        return { error: err.message, query };
    }
}

/**
 * Tool 2 — cpi_logs_fetch
 * Pulls MessageProcessingLogs from SAP Cloud Platform Integration (CPI) OData API.
 */
async function cpiLogsFetch({ iflow_name, status = "FAILED", hours = 24 }) {
    try {
        if (!process.env.CPI_HOST || !process.env.CPI_USER || !process.env.CPI_PASS) {
            return { error: "CPI credentials not configured (CPI_HOST, CPI_USER, CPI_PASS)." };
        }

        const since = new Date(Date.now() - hours * 3600 * 1000).toISOString();
        let filter = `Status eq '${status}' and LogStart ge datetime'${since}'`;
        if (iflow_name) {
            filter = `IntegrationFlowName eq '${iflow_name}' and ${filter}`;
        }

        const url =
            `${process.env.CPI_HOST}/api/v1/MessageProcessingLogs` +
            `?$filter=${encodeURIComponent(filter)}&$orderby=LogStart desc&$top=20&$format=json`;

        const res = await fetch(url, {
            headers: {
                Authorization: basicAuth(process.env.CPI_USER, process.env.CPI_PASS),
                Accept: "application/json",
            },
            timeout: 15000,
        });

        if (!res.ok) throw new Error(`CPI API returned ${res.status}`);
        const data = await res.json();
        const logs = (data.d?.results || []).map((l) => ({
            MessageGuid: l.MessageGuid,
            Status: l.Status,
            LogStart: l.LogStart,
            ErrorInfo: l.ErrorInformation,
            IntegrationFlowName: l.IntegrationFlowName,
        }));
        return { logs, count: logs.length, filter };
    } catch (err) {
        return { error: err.message };
    }
}

/**
 * Tool 3 — odata_query
 * Queries any SAP OData service.
 * Handles CSRF token fetch for non-GET methods.
 */
async function odataQuery({ service, entity, filter, top = 10, method = "GET", body }) {
    try {
        if (!process.env.SAP_HOST || !process.env.SAP_USER || !process.env.SAP_PASS) {
            return { error: "SAP credentials not configured (SAP_HOST, SAP_USER, SAP_PASS)." };
        }

        const baseUrl = `${process.env.SAP_HOST}/sap/opu/odata/sap/${service}/${entity}`;
        const params = new URLSearchParams({ $format: "json" });
        if (filter) params.set("$filter", filter);
        if (top) params.set("$top", String(top));

        const authHeader = basicAuth(process.env.SAP_USER, process.env.SAP_PASS);

        // For mutating methods, obtain a CSRF token first
        let csrfToken = null;
        if (method !== "GET") {
            const headRes = await fetch(baseUrl, {
                method: "HEAD",
                headers: { Authorization: authHeader, "x-csrf-token": "fetch" },
                timeout: 10000,
            });
            csrfToken = headRes.headers.get("x-csrf-token");
        }

        const headers = {
            Authorization: authHeader,
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        };

        const res = await fetch(`${baseUrl}?${params.toString()}`, {
            method,
            headers,
            ...(body ? { body: JSON.stringify(body) } : {}),
            timeout: 15000,
        });

        if (!res.ok) throw new Error(`OData ${service}/${entity} returned ${res.status}`);
        const data = await res.json();
        return { results: data.d?.results || data.d || data, service, entity };
    } catch (err) {
        return { error: err.message };
    }
}

/**
 * Tool 4 — knowledge_lookup
 * Queries the local knowledge_cache table.
 */
async function knowledgeLookup({ topic }) {
    try {
        const result = await pool.query(
            `SELECT topic, content, source_url, source, fetched_at
       FROM knowledge_cache
       WHERE topic ILIKE $1
       ORDER BY fetched_at DESC
       LIMIT 5`,
            [`%${topic}%`]
        );
        return { entries: result.rows, topic };
    } catch (err) {
        return { error: err.message, topic };
    }
}

// ─── Tool Registry ────────────────────────────────────────────────────────────
const TOOLS = [
    {
        name: "sap_help_search",
        description:
            "Search SAP Help Portal documentation. Use this to find official SAP documentation, guides, and API references.",
        input_schema: {
            type: "object",
            properties: {
                query: { type: "string", description: "Search query for SAP Help Portal" },
            },
            required: ["query"],
        },
    },
    {
        name: "cpi_logs_fetch",
        description:
            "Fetch message processing logs from SAP Cloud Platform Integration (CPI/BTP). Use to diagnose iFlow failures.",
        input_schema: {
            type: "object",
            properties: {
                iflow_name: { type: "string", description: "Integration flow name" },
                status: { type: "string", enum: ["FAILED", "COMPLETED", "PROCESSING", "RETRY"], default: "FAILED" },
                hours: { type: "number", description: "Number of hours back to look (default 24)", default: 24 },
            },
            required: [],
        },
    },
    {
        name: "odata_query",
        description:
            "Query any SAP OData service to retrieve live business data (e.g. sales orders, materials, BPs).",
        input_schema: {
            type: "object",
            properties: {
                service: { type: "string", description: "OData service name (e.g. API_SALES_ORDER_SRV)" },
                entity: { type: "string", description: "Entity set name (e.g. A_SalesOrder)" },
                filter: { type: "string", description: "OData $filter string" },
                top: { type: "number", description: "Max records to return (default 10)", default: 10 },
            },
            required: ["service", "entity"],
        },
    },
    {
        name: "knowledge_lookup",
        description:
            "Look up previously cached SAP knowledge from the local database. Good for quick answers on known topics.",
        input_schema: {
            type: "object",
            properties: {
                topic: { type: "string", description: "Topic or keyword to search for" },
            },
            required: ["topic"],
        },
    },
];

/** Execute a tool by name with given input */
async function executeTool(name, input) {
    switch (name) {
        case "sap_help_search": return sapHelpSearch(input);
        case "cpi_logs_fetch": return cpiLogsFetch(input);
        case "odata_query": return odataQuery(input);
        case "knowledge_lookup": return knowledgeLookup(input);
        default: return { error: `Unknown tool: ${name}` };
    }
}

// ─── Anthropic Agentic Loop ───────────────────────────────────────────────────
async function runAgentLoop({ messages, systemPrompt }) {
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured.");

    const conversationMessages = [...messages];
    const toolCallsMade = [];
    const citations = [];
    let finalText = "";

    // Agent loop — continues until no more tool_use blocks
    for (let round = 0; round < 10; round++) {
        const payload = {
            model: "claude-sonnet-4-6",
            max_tokens: 4096,
            system: systemPrompt,
            tools: TOOLS,
            messages: conversationMessages,
        };

        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify(payload),
            timeout: 60000,
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Anthropic API error ${res.status}: ${errText}`);
        }

        const response = await res.json();
        const content = response.content || [];

        // Collect text blocks
        for (const block of content) {
            if (block.type === "text") finalText = block.text;
        }

        // Check for tool_use blocks
        const toolUseBlocks = content.filter((b) => b.type === "tool_use");
        if (toolUseBlocks.length === 0) break; // Done

        // Append assistant message
        conversationMessages.push({ role: "assistant", content });

        // Execute each tool and collect results
        const toolResults = [];
        for (const toolUse of toolUseBlocks) {
            const result = await executeTool(toolUse.name, toolUse.input);
            toolCallsMade.push({ tool: toolUse.name, input: toolUse.input, result });

            // Extract citations from SAP Help results
            if (toolUse.name === "sap_help_search" && result.results) {
                for (const hit of result.results) {
                    if (hit.url) citations.push({ title: hit.title, url: hit.url });
                }
            }

            toolResults.push({
                type: "tool_result",
                tool_use_id: toolUse.id,
                content: JSON.stringify(result),
            });
        }

        // Append tool results as user message
        conversationMessages.push({ role: "user", content: toolResults });

        // Stop if Anthropic signaled end_turn
        if (response.stop_reason === "end_turn") break;
    }

    return { finalText, toolCallsMade, citations };
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /health
app.get("/health", async (req, res) => {
    let dbStatus = "ok";
    try {
        await pool.query("SELECT 1");
    } catch {
        dbStatus = "error";
    }

    const cpiStatus =
        process.env.CPI_HOST && process.env.CPI_USER && process.env.CPI_PASS
            ? "ok"
            : "not configured";
    const sapStatus =
        process.env.SAP_HOST && process.env.SAP_USER && process.env.SAP_PASS
            ? "ok"
            : "not configured";

    res.json({
        db: dbStatus,
        cpi: cpiStatus,
        sap: sapStatus,
        anthropic: process.env.ANTHROPIC_API_KEY ? "ok" : "not configured",
        timestamp: new Date().toISOString(),
    });
});

// POST /api/sessions
app.post("/api/sessions", async (req, res) => {
    try {
        const { title, sap_context } = req.body;
        const result = await pool.query(
            "INSERT INTO sessions (title, sap_context) VALUES ($1, $2) RETURNING id, title, created_at",
            [title || "New Session", sap_context || null]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.json({ error: err.message });
    }
});

// GET /api/sessions
app.get("/api/sessions", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, title, sap_context, created_at FROM sessions ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (err) {
        res.json({ error: err.message });
    }
});

// DELETE /api/sessions/:id
app.delete("/api/sessions/:id", async (req, res) => {
    try {
        await pool.query("DELETE FROM sessions WHERE id = $1", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.json({ error: err.message });
    }
});

// GET /api/sessions/:id/messages
app.get("/api/sessions/:id/messages", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, session_id, role, content, tool_calls, citations, created_at
       FROM messages
       WHERE session_id = $1
       ORDER BY created_at ASC`,
            [req.params.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.json({ error: err.message });
    }
});

// POST /api/knowledge
app.post("/api/knowledge", async (req, res) => {
    try {
        const { topic, content, source_url, source } = req.body;
        const result = await pool.query(
            `INSERT INTO knowledge_cache (topic, content, source_url, source)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [topic, content, source_url, source]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.json({ error: err.message });
    }
});

// GET /api/knowledge/:topic
app.get("/api/knowledge/:topic", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM knowledge_cache
       WHERE topic ILIKE $1
       ORDER BY fetched_at DESC
       LIMIT 10`,
            [`%${req.params.topic}%`]
        );
        res.json(result.rows);
    } catch (err) {
        res.json({ error: err.message });
    }
});

// POST /api/chat  — main AI endpoint
app.post("/api/chat", async (req, res) => {
    try {
        let { sessionId, message, provider, model, apiKey, sectionId } = req.body;

        if (!message) return res.json({ error: "message is required." });

        // 1. Ensure session exists
        if (!sessionId) {
            const sess = await pool.query(
                "INSERT INTO sessions (title) VALUES ($1) RETURNING id",
                ["New Session"]
            );
            sessionId = sess.rows[0].id;
        }

        // 2. Store user message in DB
        await pool.query(
            "INSERT INTO messages (session_id, role, content) VALUES ($1, $2, $3)",
            [sessionId, "user", message]
        );

        // 3. Check knowledge_cache for relevant SAP content
        let knowledgeContext = "";
        try {
            const keywords = message.split(" ").filter((w) => w.length > 4).slice(0, 3);
            for (const kw of keywords) {
                const kResult = await pool.query(
                    "SELECT topic, content FROM knowledge_cache WHERE topic ILIKE $1 LIMIT 3",
                    [`%${kw}%`]
                );
                if (kResult.rows.length > 0) {
                    knowledgeContext += kResult.rows.map((r) => `[${r.topic}]: ${r.content}`).join("\n");
                }
            }
        } catch {
            // Non-critical — continue without cache
        }

        // 4. Load recent message history for context (last 20 messages)
        const historyResult = await pool.query(
            `SELECT role, content FROM messages
       WHERE session_id = $1
       ORDER BY created_at ASC
       LIMIT 20`,
            [sessionId]
        );
        const conversationHistory = historyResult.rows.map((r) => ({
            role: r.role,
            content: r.content,
        }));

        // 5. Build system prompt
        const systemPrompt = [
            "You are SAP Sage — an expert AI assistant specialising in SAP systems, integration, and business processes.",
            "You have deep knowledge of SAP S/4HANA, SAP BTP, SAP Cloud Platform Integration (CPI), OData APIs, BAPIs, IDocs, and SAP Fiori.",
            "Always use the provided tools to fetch live data before answering — do not guess or hallucinate SAP-specific values.",
            "When you find information, cite your sources clearly.",
            sectionId ? `Current context: section "${sectionId}".` : "",
            knowledgeContext ? `\n\nCached knowledge:\n${knowledgeContext}` : "",
        ]
            .filter(Boolean)
            .join("\n");

        // 6. Run agent loop with Anthropic
        const { finalText, toolCallsMade, citations } = await runAgentLoop({
            messages: conversationHistory,
            systemPrompt,
        });

        // 7. Anti-hallucination scan
        const scannedReply = antiHallucinationScan(finalText);

        // 8. Store assistant message in DB
        await pool.query(
            `INSERT INTO messages (session_id, role, content, tool_calls, citations)
       VALUES ($1, $2, $3, $4, $5)`,
            [
                sessionId,
                "assistant",
                scannedReply,
                JSON.stringify(toolCallsMade),
                JSON.stringify(citations),
            ]
        );

        // 9. Auto-generate session title from first user message (max 5 words)
        try {
            const sess = await pool.query(
                "SELECT title FROM sessions WHERE id = $1",
                [sessionId]
            );
            if (sess.rows[0]?.title === "New Session") {
                const words = message
                    .replace(/[^a-zA-Z0-9 ]/g, "")
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 5)
                    .join(" ");
                await pool.query("UPDATE sessions SET title = $1 WHERE id = $2", [
                    words || "Session",
                    sessionId,
                ]);
            }
        } catch {
            // Non-critical
        }

        // 10. Return response
        res.json({
            reply: scannedReply,
            sessionId,
            toolCallsMade,
            citations,
        });
    } catch (err) {
        console.error("Chat error:", err);
        res.json({ error: err.message });
    }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
async function start() {
    try {
        await initDB();
        app.listen(PORT, () => {
            console.log(`🚀 SAP Sage backend running on http://localhost:${PORT}`);
            console.log(`   Anthropic: ${process.env.ANTHROPIC_API_KEY ? "✅ configured" : "❌ missing"}`);
            console.log(`   CPI:       ${process.env.CPI_HOST ? "✅ configured" : "⚠️  not configured"}`);
            console.log(`   SAP:       ${process.env.SAP_HOST ? "✅ configured" : "⚠️  not configured"}`);
        });
    } catch (err) {
        console.error("❌ Failed to start server:", err.message);
        // Continue running even if DB init fails — health endpoint will report it
        app.listen(PORT, () => {
            console.log(`⚠️  SAP Sage backend running (DB unavailable) on http://localhost:${PORT}`);
        });
    }
}

start();
