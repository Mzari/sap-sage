// ─── migrate.js ───────────────────────────────────────────────────────────────
// Creates all SAP Sage PostgreSQL tables. Safe to run multiple times.
// Usage: node scripts/migrate.js

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from parent directory
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

const TABLES = [
    {
        name: 'sessions',
        sql: `
      CREATE TABLE IF NOT EXISTS sessions (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title       TEXT,
        sap_context JSONB,
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `,
    },
    {
        name: 'messages',
        sql: `
      CREATE TABLE IF NOT EXISTS messages (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
        role       TEXT,
        content    TEXT,
        tool_calls JSONB,
        citations  JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `,
    },
    {
        name: 'knowledge_cache',
        sql: `
      CREATE TABLE IF NOT EXISTS knowledge_cache (
        id         SERIAL PRIMARY KEY,
        topic      TEXT,
        content    TEXT,
        source_url TEXT,
        source     TEXT,
        fetched_at TIMESTAMP DEFAULT NOW()
      );
    `,
    },
];

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('\n🗄  SAP Sage — Database Migration\n');
        for (const table of TABLES) {
            process.stdout.write(`  Creating table: ${table.name}... `);
            await client.query(table.sql);
            console.log('done ✓');
        }
        console.log('\n✅  All tables ready.\n');
        process.exit(0);
    } catch (err) {
        console.error('\n❌  Migration failed:', err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
