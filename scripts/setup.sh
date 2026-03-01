#!/bin/bash
# ─── SAP Sage Setup Script ────────────────────────────────────────────────────
set -e

echo ""
echo "=== SAP Sage v5 Setup ==="
echo ""

# ─── Check .env exists ────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ ! -f "$ROOT_DIR/.env" ]; then
  echo "ERROR: .env file not found in project root."
  echo ""
  echo "  Create $ROOT_DIR/.env with at minimum:"
  echo "    DATABASE_URL=postgres://user:pass@host:5432/dbname"
  echo "    ANTHROPIC_API_KEY=sk-ant-..."
  echo ""
  exit 1
fi
echo "✓ .env found"

# ─── Install root dependencies ─────────────────────────────────────────────────
echo ""
echo "Installing root dependencies..."
cd "$ROOT_DIR"
npm install
echo "✓ Root node_modules ready"

# ─── Install backend dependencies ─────────────────────────────────────────────
echo ""
echo "Installing backend dependencies..."
cd "$ROOT_DIR/backend"
npm install
cd "$ROOT_DIR"
echo "✓ Backend node_modules ready"

# ─── Run DB migration ─────────────────────────────────────────────────────────
echo ""
echo "Running database migration..."
node "$ROOT_DIR/scripts/migrate.js"

# ─── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo "=== Setup complete. Run: npm run dev:all ==="
echo ""
