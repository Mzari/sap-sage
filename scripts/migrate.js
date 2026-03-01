'use strict';
require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set in .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('railway') || process.env.DATABASE_URL.includes('neon')
    ? { rejectUnauthorized: false } : false,
});

async function migrate() {
  console.log('Running SAP Sage migrations...');
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    console.log('✓ pgcrypto extension');

    await pool.query(`CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT,
      sap_context JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW()
    )`);
    console.log('✓ sessions table');

    await pool.query(`CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT,
      tool_calls JSONB DEFAULT '[]',
      citations JSONB DEFAULT '[]',
      created_at TIMESTAMP DEFAULT NOW()
    )`);
    console.log('✓ messages table');

    await pool.query(`CREATE TABLE IF NOT EXISTS knowledge_cache (
      id SERIAL PRIMARY KEY,
      topic TEXT NOT NULL,
      content TEXT,
      source_url TEXT,
      source TEXT,
      fetched_at TIMESTAMP DEFAULT NOW()
    )`);
    console.log('✓ knowledge_cache table');

    await pool.query('CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_knowledge_topic ON knowledge_cache(topic)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_sessions_created ON sessions(created_at DESC)');
    console.log('✓ indexes');

    console.log('\n✓ Migration complete');
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  }
}

migrate();
