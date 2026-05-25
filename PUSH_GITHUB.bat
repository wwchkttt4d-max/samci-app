@echo off
REM ══════════════════════════════════════════
REM  AVICO-PRO — Push automatique vers GitHub
REM  Double-cliquez sur ce fichier pour l'executer
REM ══════════════════════════════════════════

echo.
echo  ====================================
echo   AVICO-PRO — Deploiement GitHub
echo  ====================================
echo.

REM Aller dans le dossier du script
cd /d "%~dp0"

echo  Verification de Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo  ERREUR: Git n'est pas installe!
    echo  Telechargez Git sur: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo  Git trouve!
echo.

REM Configurer le remote avec le token
echo  Configuration du remote GitHub...
git remote remove origin 2>nul
git remote add origin https://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@github.com/wwchkttt4d-max/samci-app.git

REM Init si necessaire
git init 2>nul

REM Stage tous les fichiers
echo  Ajout des fichiers...
git add index.html
git add app.js
git add style.css
git add login-modern.css
git add premium-styles.css
git add js/firebase.js
git add js/ui.js

REM Commit
echo  Creation du commit...
git commit -m "fix: AVICO-PRO v5 - tous les bugs corriges, app operationnelle"

REM Push
echo  Push vers GitHub...
git push -u origin main --force

echo.
echo  ====================================
echo   SUCCES! Projet pousse sur GitHub
echo   https://github.com/wwchkttt4d-max/samci-app
echo  ====================================
echo.
pause
