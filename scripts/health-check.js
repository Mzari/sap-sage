'use strict';
const fetch = require('node-fetch');
const BASE = process.env.BACKEND_URL || 'http://localhost:3001';

async function check() {
  console.log('\nSAP Sage Health Check');
  console.log('─'.repeat(50));
  try {
    const res  = await fetch(`${BASE}/health`, { timeout: 5000 });
    const data = await res.json();
    const ok   = (v) => v === 'ok' || v === 'configured';
    console.log(`Backend API      ${res.ok ? '✓ OK' : '✗ ERROR'}     ${BASE}`);
    console.log(`PostgreSQL DB    ${ok(data.db) ? '✓ OK' : '✗ ' + data.db}`);
    console.log(`Anthropic API    ${ok(data.anthropic) ? '✓ OK' : '✗ not configured'}`);
    console.log(`CPI Connection   ${data.cpi?.includes('not') ? '○ Optional' : '✓ ' + data.cpi}`);
    console.log(`SAP Connection   ${data.sap?.includes('not') ? '○ Optional' : '✓ ' + data.sap}`);
    console.log('─'.repeat(50));
    console.log(`Version: ${data.version || 'unknown'}`);
  } catch (e) {
    console.log('✗ Backend unreachable —', e.message);
    console.log('  Run: npm run dev:all');
  }
  console.log('');
}

check();
