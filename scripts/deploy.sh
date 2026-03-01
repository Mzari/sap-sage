#!/bin/bash
# ─── SAP Sage Deploy Script ───────────────────────────────────────────────────
set -e

echo ""
echo "=== SAP Sage Deploy ==="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

# ─── Build frontend ────────────────────────────────────────────────────────────
echo "Building frontend..."
npm run build
echo "✓ Build complete"

# ─── Git commit & push ─────────────────────────────────────────────────────────
echo ""
echo "Committing and pushing..."
git add -A
git commit -m "deploy: $(date +%Y-%m-%d\ %H:%M)"
git push origin main

echo ""
echo "✓ Pushed to GitHub. Railway will auto-deploy backend in ~2 minutes."
echo "  Check: railway logs --tail"
echo ""
