@echo off
title AVICO-PRO - Serveur local
cd /d "%~dp0"

echo ========================================
echo   AVICO-PRO - LANCEMENT LOCAL
echo ========================================
echo.
echo Demarrage du serveur local...
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js n'est pas installe.
    echo Installe Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo Serveur disponible sur:
echo   http://127.0.0.1:3000/
echo   http://localhost:3000/
echo.
echo Important: garde cette fenetre ouverte pendant l'utilisation.
echo Pour arreter le serveur: Ctrl+C
echo.

node local-server.js

echo.
echo Le serveur s'est arrete.
pause
