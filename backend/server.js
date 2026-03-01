'use strict';
require('dotenv').config({ path: '../.env' });

const express  = require('express');
const { Pool } = require('pg');
const cors     = require('cors');
const fetch    = require('node-fetch');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.VITE_API_URL || '',
    /\.vercel\.app$/,
    /\.railway\.app$/,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

// ─── PostgreSQL pool ──────────────────────────────────────────────────────────
let pool = null;
let dbStatus = 'not configured';

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('railway') || process.env.DATABASE_URL.includes('neon')
      ? { rejectUnauthorized: false }
      : false,
  });
  dbStatus = 'connecting';
}

// ─── DB: create tables on startup ────────────────────────────────────────────
async function initDB() {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE TABLE IF NOT EXISTS sessions (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title      TEXT,
        sap_context JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS messages (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id  UUID REFERENCES sessions(id) ON DELETE CASCADE,
        role        TEXT NOT NULL,
        content     TEXT,
        tool_calls  JSONB DEFAULT '[]',
        citations   JSONB DEFAULT '[]',
        created_at  TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS knowledge_cache (
        id         SERIAL PRIMARY KEY,
        topic      TEXT NOT NULL,
        content    TEXT,
        source_url TEXT,
        source     TEXT,
        fetched_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
      CREATE INDEX IF NOT EXISTS idx_knowledge_topic  ON knowledge_cache(topic);
      CREATE INDEX IF NOT EXISTS idx_sessions_created ON sessions(created_at DESC);
    `);
    dbStatus = 'ok';
    console.log('[DB] Tables ready');
  } catch (e) {
    dbStatus = `error: ${e.message}`;
    console.error('[DB] Init error:', e.message);
  }
}

// ─── Helper: resolve SAP connection (env vars OR frontend-passed config) ──────
// Frontend stores credentials in localStorage and passes them per-request
// via the sapConnections field in the request body. This lets the UI be
// the source of truth without requiring env vars for optional systems.
function resolveSapConfig(body, systemId) {
  // Priority 1: frontend-passed connection (from localStorage in the browser)
  const fromFrontend = body?.sapConnections?.[systemId];
  if (fromFrontend?.host) return fromFrontend;

  // Priority 2: environment variables
  if (systemId === 'cpi' && process.env.CPI_HOST) {
    return { host: process.env.CPI_HOST, user: process.env.CPI_USER, pass: process.env.CPI_PASS };
  }
  if ((systemId === 's4op' || systemId === 'ecc' || systemId === 'sap') && process.env.SAP_HOST) {
    return { host: process.env.SAP_HOST, user: process.env.SAP_USER, pass: process.env.SAP_PASS, client: process.env.SAP_CLIENT || '100' };
  }
  return null;
}

function basicAuth(user, pass) {
  return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
}

// ─── Tool implementations ─────────────────────────────────────────────────────

async function sapHelpSearch(query) {
  try {
    const url = `https://help.sap.com/http.svc/search?q=${encodeURIComponent(query)}&language=en&product=`;
    const res = await fetch(url, { timeout: 8000 });
    if (!res.ok) return { error: `SAP Help returned ${res.status}` };
    const data = await res.json();
    const results = (data.hits || []).slice(0, 5).map(h => ({
      title: h.title || '',
      url:   h.url || h.link || '',
      snippet: (h.content || h.description || '').slice(0, 300),
    }));
    return { results, source: 'sap-help' };
  } catch (e) {
    return { error: e.message, results: [] };
  }
}

async function cpiLogsFetch(cfg, iflowName, status = 'FAILED', hours = 24) {
  if (!cfg) return { error: 'CPI not configured — add connection in SAP Connect panel', logs: [] };
  try {
    const since = new Date(Date.now() - hours * 3600000).toISOString();
    let filter = `CreationDate gt datetime'${since}'`;
    if (iflowName) filter += ` and IntegrationFlowName eq '${iflowName}'`;
    if (status)    filter += ` and Status eq '${status}'`;
    const url = `${cfg.host}/api/v1/MessageProcessingLogs?$filter=${encodeURIComponent(filter)}&$top=20&$orderby=CreationDate desc&$format=json`;
    const res = await fetch(url, { headers: { Authorization: basicAuth(cfg.user, cfg.pass), Accept: 'application/json' }, timeout: 10000 });
    if (!res.ok) return { error: `CPI returned HTTP ${res.status}`, logs: [] };
    const data = await res.json();
    const logs = (data.d?.results || []).map(l => ({
      MessageGuid: l.MessageGuid,
      Status:      l.Status,
      LogStart:    l.LogStart,
      ErrorInfo:   l.ErrorInformation || l.AdapterAttributes?.ErrorInformation || '',
      iFlowName:   l.IntegrationFlowName,
    }));
    return { logs, count: logs.length, source: 'cpi-live' };
  } catch (e) {
    return { error: e.message, logs: [] };
  }
}

async function odataQuery(cfg, service, entity, filter = '', top = 10, expand = '') {
  if (!cfg) return { error: 'SAP system not configured — add connection in SAP Connect panel', results: [] };
  try {
    const client = cfg.client || '100';
    let url = `${cfg.host}/sap/opu/odata/sap/${service}/${entity}?$format=json&sap-client=${client}&$top=${top}`;
    if (filter) url += `&$filter=${encodeURIComponent(filter)}`;
    if (expand) url += `&$expand=${encodeURIComponent(expand)}`;
    const res = await fetch(url, { headers: { Authorization: basicAuth(cfg.user, cfg.pass), Accept: 'application/json' }, timeout: 12000 });
    if (!res.ok) return { error: `SAP OData returned HTTP ${res.status}`, results: [] };
    const data = await res.json();
    const results = data.d?.results || data.value || [];
    return { results, count: results.length, service, entity, source: 'sap-live' };
  } catch (e) {
    return { error: e.message, results: [] };
  }
}

async function knowledgeLookup(topic) {
  if (!pool) return { content: null };
  try {
    const r = await pool.query(
      `SELECT content, source_url, source FROM knowledge_cache
       WHERE topic ILIKE $1 AND fetched_at > NOW() - INTERVAL '7 days'
       ORDER BY fetched_at DESC LIMIT 3`,
      [`%${topic}%`]
    );
    return { results: r.rows, count: r.rows.length };
  } catch {
    return { results: [] };
  }
}

// ─── Anthropic tool definitions ───────────────────────────────────────────────
const TOOLS = [
  {
    name: 'sap_help_search',
    description: 'Search the SAP Help Portal for official documentation on any SAP topic. Use this for configuration steps, transaction codes, API documentation, and functional concepts.',
    input_schema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Search query (e.g. "CPI CSRF token OData")' } },
      required: ['query'],
    },
  },
  {
    name: 'cpi_logs_fetch',
    description: 'Fetch real message processing logs from SAP Cloud Integration (CPI). Use when user asks about failed messages, integration errors, or iFlow status.',
    input_schema: {
      type: 'object',
      properties: {
        iflow_name: { type: 'string', description: 'iFlow name to filter (optional — leave empty for all)' },
        status:     { type: 'string', enum: ['FAILED', 'COMPLETED', 'PROCESSING', 'RETRY', 'ESCALATED'], description: 'Message status filter' },
        hours:      { type: 'number', description: 'How many hours back to look (default 24)' },
      },
    },
  },
  {
    name: 'odata_query',
    description: 'Query a live SAP OData service (S/4HANA or ECC). Use to fetch real SAP data like purchase orders, materials, BPs, or verify entity structures.',
    input_schema: {
      type: 'object',
      properties: {
        service: { type: 'string', description: 'OData service name (e.g. API_PURCHASEORDER_PROCESS_SRV)' },
        entity:  { type: 'string', description: 'Entity set name (e.g. A_PurchaseOrder)' },
        filter:  { type: 'string', description: 'OData $filter expression (optional)' },
        top:     { type: 'number', description: 'Max records to return (default 10)' },
      },
      required: ['service', 'entity'],
    },
  },
  {
    name: 'knowledge_lookup',
    description: 'Look up cached SAP documentation from the local knowledge base. Try this first before searching SAP Help for recently cached topics.',
    input_schema: {
      type: 'object',
      properties: { topic: { type: 'string', description: 'Topic keyword to search in knowledge cache' } },
      required: ['topic'],
    },
  },
];

// ─── Execute a single tool call ───────────────────────────────────────────────
async function executeTool(toolName, toolInput, reqBody) {
  switch (toolName) {
    case 'sap_help_search':
      return sapHelpSearch(toolInput.query);

    case 'cpi_logs_fetch': {
      const cpiCfg = resolveSapConfig(reqBody, 'cpi');
      return cpiLogsFetch(cpiCfg, toolInput.iflow_name, toolInput.status, toolInput.hours || 24);
    }

    case 'odata_query': {
      // Try s4op first, then ecc, then generic 'sap'
      const sapCfg = resolveSapConfig(reqBody, 's4op') || resolveSapConfig(reqBody, 'ecc') || resolveSapConfig(reqBody, 'sap');
      return odataQuery(sapCfg, toolInput.service, toolInput.entity, toolInput.filter, toolInput.top || 10, toolInput.expand);
    }

    case 'knowledge_lookup':
      return knowledgeLookup(toolInput.topic);

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

// ─── Anti-hallucination scan ──────────────────────────────────────────────────
function scanForUnverified(text) {
  const matches = text.match(/\b(BAPI_[A-Z0-9_]+|FM_[A-Z0-9_]+)\b/g);
  if (!matches?.length) return text;
  const unique = [...new Set(matches)];
  return text + `\n\n> ⚠ **Verify in system:** ${unique.join(', ')} — function module names mentioned above are unconfirmed against live system data.`;
}

// ─── Generate session title ───────────────────────────────────────────────────
async function generateTitle(message, apiKey) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 20,
        messages: [{ role: 'user', content: `Summarize this in 4-5 words for a chat title (no quotes, no punctuation): ${message.slice(0, 200)}` }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text?.trim() || message.slice(0, 40);
  } catch {
    return message.slice(0, 40);
  }
}

// ─── Main AI chat with tool loop ──────────────────────────────────────────────
async function runChatWithTools(messages, systemPrompt, apiKey, reqBody) {
  const toolCallsMade = [];
  const citations     = [];
  let   currentMessages = [...messages];

  for (let round = 0; round < 8; round++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-6',
        max_tokens: 4096,
        system:     systemPrompt,
        tools:      TOOLS,
        messages:   currentMessages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API ${res.status}: ${err.slice(0, 300)}`);
    }

    const data       = await res.json();
    const stopReason = data.stop_reason;
    const content    = data.content || [];

    // Collect text blocks
    const textBlocks = content.filter(b => b.type === 'text').map(b => b.text).join('');

    // If no tool calls, we're done
    if (stopReason !== 'tool_use') {
      return { reply: scanForUnverified(textBlocks), toolCallsMade, citations };
    }

    // Execute all tool calls in this response
    const toolUseBlocks  = content.filter(b => b.type === 'tool_use');
    const toolResultsParts = [];

    for (const tu of toolUseBlocks) {
      const result = await executeTool(tu.name, tu.input, reqBody);
      toolCallsMade.push({ tool: tu.name, input: tu.input, resultSummary: JSON.stringify(result).slice(0, 120) });

      // Track citations from SAP Help results
      if (result.results) {
        result.results.filter(r => r.url).forEach(r => citations.push({ title: r.title, url: r.url }));
      }

      toolResultsParts.push({
        type:        'tool_result',
        tool_use_id: tu.id,
        content:     JSON.stringify(result),
      });
    }

    // Append assistant turn + tool results and loop
    currentMessages = [
      ...currentMessages,
      { role: 'assistant', content },
      { role: 'user',      content: toolResultsParts },
    ];
  }

  return { reply: 'Max tool rounds reached.', toolCallsMade, citations };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  let db = dbStatus;
  if (pool && dbStatus === 'ok') {
    try { await pool.query('SELECT 1'); } catch (e) { db = `error: ${e.message}`; }
  }
  res.json({
    db,
    cpi: process.env.CPI_HOST ? 'configured' : 'not configured (optional)',
    sap: process.env.SAP_HOST ? 'configured' : 'not configured (optional)',
    dynamicConnections: 'supported — pass sapConnections in request body',
    version: '5.0.0',
  });
});

// ── Sessions: create ─────────────────────────────────────────────────────────
app.post('/api/sessions', async (req, res) => {
  if (!pool) return res.json({ id: null, title: 'Local session', error: 'No DB' });
  try {
    const { sectionId = 'default' } = req.body;
    const r = await pool.query(
      `INSERT INTO sessions (title, sap_context) VALUES ($1, $2) RETURNING id, title, created_at`,
      ['New conversation', JSON.stringify({ sectionId })]
    );
    res.json(r.rows[0]);
  } catch (e) {
    res.json({ error: e.message });
  }
});

// ── Sessions: list ────────────────────────────────────────────────────────────
app.get('/api/sessions', async (req, res) => {
  if (!pool) return res.json([]);
  try {
    const r = await pool.query(`SELECT id, title, sap_context, created_at FROM sessions ORDER BY created_at DESC LIMIT 200`);
    res.json(r.rows);
  } catch (e) {
    res.json([]);
  }
});

// ── Sessions: messages ────────────────────────────────────────────────────────
app.get('/api/sessions/:id/messages', async (req, res) => {
  if (!pool) return res.json([]);
  try {
    const r = await pool.query(
      `SELECT id, role, content, tool_calls, citations, created_at FROM messages WHERE session_id = $1 ORDER BY created_at ASC`,
      [req.params.id]
    );
    res.json(r.rows);
  } catch (e) {
    res.json([]);
  }
});

// ── Sessions: delete ──────────────────────────────────────────────────────────
app.delete('/api/sessions/:id', async (req, res) => {
  if (!pool) return res.json({ ok: false });
  try {
    await pool.query('DELETE FROM sessions WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.json({ error: e.message });
  }
});

// ── Knowledge: store ──────────────────────────────────────────────────────────
app.post('/api/knowledge', async (req, res) => {
  if (!pool) return res.json({ ok: false, error: 'No DB' });
  try {
    const { topic, content, sourceUrl, source = 'manual' } = req.body;
    await pool.query(
      `INSERT INTO knowledge_cache (topic, content, source_url, source) VALUES ($1, $2, $3, $4)`,
      [topic, content, sourceUrl, source]
    );
    res.json({ ok: true });
  } catch (e) {
    res.json({ error: e.message });
  }
});

// ── Knowledge: retrieve ───────────────────────────────────────────────────────
app.get('/api/knowledge/:topic', async (req, res) => {
  const result = await knowledgeLookup(req.params.topic);
  res.json(result);
});

// ── MAIN CHAT ─────────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const {
      sessionId:   incomingSessionId,
      message,
      provider     = 'anthropic',
      model        = 'claude-sonnet-4-6',
      apiKey,
      sectionId    = 'default',
      systemPrompt = '',
      sapConnections, // passed from frontend localStorage
    } = req.body;

    if (!message) return res.json({ error: 'message is required' });

    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key)  return res.json({ error: 'No Anthropic API key — add one in the Provider bar or set ANTHROPIC_API_KEY env var' });

    // ── Resolve or create session ──────────────────────────────────────────────
    let sessionId = incomingSessionId;
    if (!sessionId && pool) {
      const sr = await pool.query(
        `INSERT INTO sessions (title, sap_context) VALUES ($1, $2) RETURNING id`,
        ['New conversation', JSON.stringify({ sectionId })]
      );
      sessionId = sr.rows[0].id;
    }

    // ── Store user message ─────────────────────────────────────────────────────
    if (pool && sessionId) {
      await pool.query(
        `INSERT INTO messages (session_id, role, content) VALUES ($1, $2, $3)`,
        [sessionId, 'user', message]
      );
    }

    // ── Build message history for this session ─────────────────────────────────
    let historyMessages = [];
    if (pool && sessionId) {
      const hr = await pool.query(
        `SELECT role, content FROM messages WHERE session_id = $1 ORDER BY created_at ASC LIMIT 40`,
        [sessionId]
      );
      historyMessages = hr.rows.map(m => ({ role: m.role, content: m.content }));
    } else {
      historyMessages = [{ role: 'user', content: message }];
    }

    // ── Check knowledge cache for context enrichment ───────────────────────────
    let knowledgeContext = '';
    if (pool) {
      const words = message.split(' ').filter(w => w.length > 4).slice(0, 3).join(' ');
      const cached = await knowledgeLookup(words);
      if (cached.results?.length) {
        knowledgeContext = `\n\nRelevant cached knowledge:\n${cached.results.map(r => `[${r.source}] ${r.content?.slice(0,400)}`).join('\n---\n')}`;
      }
    }

    const sysPrompt = (systemPrompt || `You are SAP Sage, an expert SAP integration architect and consultant with deep knowledge of all SAP products, landscapes, and integration patterns. Provide technically precise, detailed, and directly actionable responses. Always cite sources when using search results. If you are unsure about something, use the sap_help_search tool to verify before answering.`) + knowledgeContext;

    // ── Run AI with tool loop ──────────────────────────────────────────────────
    const { reply, toolCallsMade, citations } = await runChatWithTools(
      historyMessages,
      sysPrompt,
      key,
      req.body   // passed through for resolveSapConfig
    );

    // ── Store assistant message ────────────────────────────────────────────────
    if (pool && sessionId) {
      await pool.query(
        `INSERT INTO messages (session_id, role, content, tool_calls, citations) VALUES ($1, $2, $3, $4, $5)`,
        [sessionId, 'assistant', reply, JSON.stringify(toolCallsMade), JSON.stringify(citations)]
      );
    }

    // ── Auto-generate session title on first message ───────────────────────────
    if (pool && sessionId) {
      const countR = await pool.query(`SELECT COUNT(*) FROM messages WHERE session_id = $1`, [sessionId]);
      if (parseInt(countR.rows[0].count) <= 2) {
        const title = await generateTitle(message, key);
        await pool.query(`UPDATE sessions SET title = $1 WHERE id = $2`, [title, sessionId]);
      }
    }

    res.json({ reply, sessionId, toolCallsMade, citations });

  } catch (e) {
    console.error('[/api/chat] error:', e.message);
    res.json({ error: e.message });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[SAP Sage Backend] Running on port ${PORT}`);
    console.log(`[SAP Sage Backend] DB: ${dbStatus}`);
    console.log(`[SAP Sage Backend] CPI: ${process.env.CPI_HOST || 'not configured (optional)'}`);
    console.log(`[SAP Sage Backend] SAP: ${process.env.SAP_HOST || 'not configured (optional)'}`);
    console.log(`[SAP Sage Backend] Dynamic connections: enabled (via frontend sapConnections)`);
  });
});
