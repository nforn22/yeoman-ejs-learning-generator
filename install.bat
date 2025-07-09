@echo off
REM script d'installation des dépendances pour le générateur portable

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js n'est pas installe. Veuillez l'installer puis relancez ce script.
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo npm n'est pas installe. Veuillez l'installer puis relancez ce script.
    exit /b 1
)

echo Installation des dependances Node.js...
npm install

echo Installation terminee. Vous pouvez lancer run-generator.bat 