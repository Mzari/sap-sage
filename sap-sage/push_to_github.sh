#!/bin/bash
# ─── SAP Sage → GitHub Push Script ─────────────────────────────────────────
# Usage: bash push_to_github.sh YOUR_GITHUB_USERNAME

GITHUB_USER=${1:-"YOUR_GITHUB_USERNAME"}
REPO_NAME="sap-sage"

echo ""
echo "═══════════════════════════════════════════"
echo "  SAP Sage → GitHub Push"
echo "═══════════════════════════════════════════"
echo ""

# Step 1: Init git
cd /path/to/sap-sage   # ← change this to where you saved the project
git init
git add .
git commit -m "🚀 SAP Sage v3.0 - Full Spectrum SAP Intelligence Platform"

# Step 2: Create repo on GitHub and push
# Option A: Using GitHub CLI (gh) — easiest
if command -v gh &> /dev/null; then
  echo "→ Using GitHub CLI..."
  gh repo create $REPO_NAME --public --source=. --remote=origin --push
  echo "✓ Pushed! Visit: https://github.com/$GITHUB_USER/$REPO_NAME"
else
  # Option B: Manual — create repo at github.com/new first
  echo "→ GitHub CLI not found. Manual steps:"
  echo ""
  echo "1. Go to: https://github.com/new"
  echo "2. Repository name: $REPO_NAME"
  echo "3. Click 'Create repository'"
  echo "4. Run these commands:"
  echo ""
  echo "   git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git"
  echo "   git branch -M main"
  echo "   git push -u origin main"
fi

echo ""
echo "═══════════════════════════════════════════"
echo "  After push → Deploy to Vercel (Free)"
echo "═══════════════════════════════════════════"
echo ""
echo "Option 1: Vercel CLI"
echo "  npm install -g vercel"
echo "  vercel --prod"
echo ""
echo "Option 2: vercel.com → Import Git Repository"
echo "  → Select your repo → Add env vars → Deploy"
echo ""
echo "  Env vars to add in Vercel dashboard:"
echo "  VITE_GROQ_API_KEY = your_groq_key"
echo "  VITE_ANTHROPIC_API_KEY = your_anthropic_key (optional)"
echo ""
