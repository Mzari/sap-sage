// ─── knowledge-refresh.js ─────────────────────────────────────────────────────
// Extracts topics from QUICK_PROMPTS, fetches SAP Help docs, caches in DB.
// Usage: node scripts/knowledge-refresh.js

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = require('pg');
const nodeFetch = require('node-fetch');

const API_BASE = process.env.VITE_API_URL || 'http://localhost:3001';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// ─── Load QUICK_PROMPTS from constants.js ─────────────────────────────────────
// constants.js is an ES module with a large export — we read it as text and
// extract the QUICK_PROMPTS object via regex to avoid full transpilation.
function extractTopicsFromConstants() {
    const constantsPath = path.resolve(__dirname, '../src/constants.js');
    if (!fs.existsSync(constantsPath)) {
        console.error('❌  Could not find src/constants.js');
        return [];
    }

    const text = fs.readFileSync(constantsPath, 'utf8');

    // Find all strings inside QUICK_PROMPTS — grab quoted strings after array brackets
    const prompts = [];
    const strRegex = /'([^']{10,150})'/g;
    const qpStart = text.indexOf('QUICK_PROMPTS');
    if (qpStart === -1) return [];

    const section = text.slice(qpStart, qpStart + 60000); // up to 60k chars
    let match;
    while ((match = strRegex.exec(section)) !== null) {
        const str = match[1].trim();
        // Filter obvious non-prompt strings (section names, IDs, etc.)
        if (str.length > 15 && str.includes(' ') && !str.startsWith('#') && !/^[A-Z_]+$/.test(str)) {
            prompts.push(str);
        }
    }

    return prompts;
}

// ─── Extract topic keyword from a prompt ──────────────────────────────────────
function extractTopic(prompt) {
    // Take first 3 meaningful words, strip question marks/punctuation
    return prompt
        .replace(/[?!,.:'"]/g, '')
        .split(' ')
        .filter(w => w.length > 2)
        .slice(0, 3)
        .join(' ')
        .toLowerCase();
}

// ─── Fetch from SAP Help API ──────────────────────────────────────────────────
async function fetchSapHelp(topic) {
    try {
        const url = `https://help.sap.com/api/search?query=${encodeURIComponent(topic)}&language=en&state=PRODUCTION`;
        const res = await nodeFetch(url, {
            headers: { Accept: 'application/json', 'User-Agent': 'SAP-Sage-Bot/1.0' },
            timeout: 12000,
        });
        if (!res.ok) return null;
        const data = await res.json();
        const hits = data.hits || data.results || [];
        if (!hits.length) return null;

        const top = hits[0];
        return {
            title: top.title || topic,
            content: (top.excerpt || top.description || top.title || '').slice(0, 1000),
            source_url: top.url || top.link || '',
            source: 'sap-help',
        };
    } catch {
        return null;
    }
}

// ─── Check if topic is already fresh (within 7 days) ─────────────────────────
async function isTopicFresh(client, topic) {
    const r = await client.query(
        `SELECT id FROM knowledge_cache
     WHERE topic ILIKE $1 AND fetched_at > NOW() - INTERVAL '7 days'
     LIMIT 1`,
        [`%${topic}%`]
    );
    return r.rows.length > 0;
}

// ─── Store knowledge item via API ─────────────────────────────────────────────
async function storeKnowledge(item) {
    try {
        const res = await nodeFetch(`${API_BASE}/api/knowledge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: item.title,
                content: item.content,
                source_url: item.source_url,
                source: item.source,
            }),
            timeout: 8000,
        });
        return res.ok;
    } catch {
        return false;
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('\n🔄  SAP Sage — Knowledge Refresh\n');

    const prompts = extractTopicsFromConstants();
    const rawTopics = prompts.map(extractTopic);
    // Deduplicate
    const topics = [...new Set(rawTopics)].filter(Boolean);

    console.log(`  Found ${topics.length} unique topics from QUICK_PROMPTS\n`);

    const client = await pool.connect();
    let cached = 0, fresh = 0, errors = 0;

    try {
        for (let i = 0; i < topics.length; i++) {
            const topic = topics[i];
            const progress = `[${String(i + 1).padStart(String(topics.length).length)}/${topics.length}]`;

            // Check freshness
            if (await isTopicFresh(client, topic)) {
                process.stdout.write(`  ${progress} ⏭  Already fresh: ${topic}\n`);
                fresh++;
                continue;
            }

            process.stdout.write(`  ${progress} 🔍 Fetching: ${topic}...`);
            const item = await fetchSapHelp(topic);

            if (!item) {
                process.stdout.write(' no results\n');
                errors++;
                continue;
            }

            const ok = await storeKnowledge(item);
            if (ok) {
                process.stdout.write(` cached ✓\n`);
                cached++;
            } else {
                process.stdout.write(` store failed\n`);
                errors++;
            }

            // Rate-limit: 200ms between requests
            await new Promise(r => setTimeout(r, 200));
        }
    } finally {
        client.release();
        await pool.end();
    }

    console.log('\n─────────────────────────────────────────');
    console.log(`  ✅  Cached:       ${cached} topics`);
    console.log(`  ⏭   Already fresh: ${fresh} topics`);
    console.log(`  ❌  Errors:       ${errors}`);
    console.log('─────────────────────────────────────────\n');

    process.exit(errors > topics.length * 0.5 ? 1 : 0);
}

main().catch(err => {
    console.error('❌  Knowledge refresh failed:', err.message);
    process.exit(1);
});
