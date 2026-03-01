#!/bin/bash
set -e
echo "=== SAP Sage Deploy ==="
npm run build
git add -A
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" || echo "Nothing new to commit"
git push origin main
echo ""
echo "✓ Pushed to GitHub"
echo "✓ Railway auto-deploys backend in ~2 min"
echo "✓ Vercel auto-deploys frontend in ~30 sec"
echo ""
echo "Backend: https://sap-sage-production.up.railway.app/health"
