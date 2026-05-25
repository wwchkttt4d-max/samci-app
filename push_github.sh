#!/bin/bash
# ══════════════════════════════════════════
#  AVICO-PRO — Push automatique vers GitHub
#  Exécutez: bash push_github.sh
# ══════════════════════════════════════════

cd "$(dirname "$0")"

TOKEN="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"
REPO="wwchkttt4d-max/samci-app"

echo ""
echo "🚀 AVICO-PRO — Déploiement GitHub"
echo "=================================="
echo ""

# Configure remote avec token
git remote remove origin 2>/dev/null
git remote add origin "https://${TOKEN}@github.com/${REPO}.git"
git init 2>/dev/null

# Stage les fichiers corrigés
git add index.html app.js style.css login-modern.css premium-styles.css js/firebase.js js/ui.js

# Commit
git commit -m "fix: AVICO-PRO v5 - tous les bugs corrigés, app opérationnelle"

# Push
git push -u origin main --force

echo ""
echo "✅ Projet poussé avec succès !"
echo "🔗 https://github.com/${REPO}"
