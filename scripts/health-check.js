// ─── health-check.js ─────────────────────────────────────────────────────────
// Checks all SAP Sage services and prints a colored status table.
// Usage: node scripts/health-check.js

const API_BASE = process.env.VITE_API_URL || 'http://localhost:3001';

// ─── ANSI colors ──────────────────────────────────────────────────────────────
const G = '\x1b[32m';   // green
const R = '\x1b[31m';   // red
const Y = '\x1b[33m';   // yellow
const B = '\x1b[36m';   // cyan/blue
const DIM = '\x1b[2m';
const RST = '\x1b[0m';
const BOLD = '\x1b[1m';

function pad(str, len) {
    return String(str).padEnd(len, ' ');
}

function statusColor(ok, val) {
    if (ok === 'ok') return `${G}${BOLD}OK   ${RST}`;
    if (ok === 'not configured') return `${Y}${BOLD}NOT SET${RST}`;
    return `${R}${BOLD}ERROR${RST}`;
}

async function run() {
    console.log(`\n${BOLD}SAP Sage — Health Check${RST}`);
    console.log(`${DIM}${API_BASE}${RST}\n`);

    let data = null;
    let backendOk = false;

    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
        clearTimeout(timer);
        if (res.ok) {
            data = await res.json();
            backendOk = true;
        }
    } catch {
        backendOk = false;
    }

    const rows = [
        {
            label: 'Backend API',
            status: backendOk ? 'ok' : 'error',
            detail: backendOk ? API_BASE : 'Cannot reach backend — is it running?',
        },
        {
            label: 'PostgreSQL DB',
            status: data?.db || (backendOk ? 'error' : 'error'),
            detail: data?.db === 'ok' ? 'connected' : 'check DATABASE_URL',
        },
        {
            label: 'CPI Connection',
            status: data?.cpi || 'not configured',
            detail: data?.cpi === 'ok' ? (process.env.CPI_HOST || 'configured') : 'set CPI_HOST, CPI_USER, CPI_PASS in .env',
        },
        {
            label: 'SAP Connection',
            status: data?.sap || 'not configured',
            detail: data?.sap === 'ok' ? (process.env.SAP_HOST || 'configured') : 'set SAP_HOST, SAP_USER, SAP_PASS in .env',
        },
        {
            label: 'Anthropic API',
            status: data?.anthropic || 'not configured',
            detail: data?.anthropic === 'ok' ? 'ANTHROPIC_API_KEY set' : 'set ANTHROPIC_API_KEY in .env',
        },
    ];

    // Header
    console.log(
        `  ${BOLD}${pad('Service', 18)}${pad('Status', 12)}${pad('Detail', 50)}${RST}`
    );
    console.log(`  ${DIM}${'─'.repeat(78)}${RST}`);

    let anyRequired = false;
    for (const row of rows) {
        const statusStr = statusColor(row.status, row.detail);
        console.log(`  ${B}${pad(row.label, 18)}${RST}${statusStr}  ${DIM}${row.detail}${RST}`);

        // Backend and DB are required; CPI/SAP optional
        if ((row.label === 'Backend API' || row.label === 'PostgreSQL DB') && row.status !== 'ok') {
            anyRequired = true;
        }
    }

    console.log(`\n  ${DIM}Checked at: ${new Date().toLocaleString()}${RST}\n`);

    process.exit(anyRequired ? 1 : 0);
}

run().catch(err => {
    console.error('Health check failed:', err.message);
    process.exit(1);
});
