#!/usr/bin/env node

/**
 * script pour créer automatiquement les scripts de lancement dans le dossier dist après build de pkg
 */

import fs from 'fs';
import path from 'path';

const distPath = './dist';

// vérifie si le dossier dist existe
if (!fs.existsSync(distPath)) {
    console.log('📁 Dossier dist non trouvé, création...');
    fs.mkdirSync(distPath, { recursive: true });
}

// script shell pour Linux/Mac
const shellScript = `#!/bin/bash

# script de lancement pour le générateur Yeoman packagé
# Usage: ./run-generator.sh

set -e  # Arrêter en cas d'erreur

# couleurs pour les messages
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

echo -e "\${BLUE}🚀 Lancement du générateur Yeoman packagé\${NC}"

# détecte l'exécutable approprié
executable=""
if [[ -f "./generator-first-test-linux" ]]; then
    executable="./generator-first-test-linux"
elif [[ -f "./generator-first-test-macos" ]]; then
    executable="./generator-first-test-macos"
else
    echo -e "\${RED}❌ Erreur: Aucun exécutable trouvé\${NC}"
    echo -e "\${YELLOW}💡 Fichiers disponibles:\${NC}"
    ls -la generator-first-test-* 2>/dev/null || echo "   Aucun fichier trouvé"
    exit 1
fi

# rendre l'exécutable, exécutable (Linux/Mac)
chmod +x "\$executable"

# lance le générateur
echo -e "\${GREEN}✅ Démarrage du générateur avec: \$executable\${NC}"
"\$executable"

echo -e "\${GREEN}✅ Générateur terminé avec succès !\${NC}"
`;

// script batch pour Windows
const batchScript = `@echo off
REM script de lancement pour le générateur Yeoman packagé (Windows)
REM usage: run-generator.bat

echo 🚀 Lancement du générateur Yeoman packagé

REM Vérifier si l'exécutable existe
if not exist "generator-first-test-win.exe" (
    echo ❌ Erreur: L'exécutable 'generator-first-test-win.exe' n'existe pas
    echo 💡 Fichiers disponibles:
    dir generator-first-test-* 2>nul || echo    Aucun fichier trouvé
    pause
    exit /b 1
)

REM Lancer le générateur
echo ✅ Démarrage du générateur...
generator-first-test-win.exe

if %ERRORLEVEL% EQU 0 (
    echo ✅ Générateur terminé avec succès !
) else (
    echo ❌ Erreur lors de l'exécution du générateur
    pause
    exit /b 1
)

pause
`;

// script PowerShell universel
const powershellScript = `# Script de lancement universel pour le générateur packagé
# Usage: .\\run-generator.ps1

param(
    [switch]$Help
)

if ($Help) {
    Write-Host "Usage: .\\run-generator.ps1" -ForegroundColor Cyan
    Write-Host "Lance le générateur Yeoman packagé" -ForegroundColor Gray
    exit 0
}

# Couleurs pour les messages
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

Write-Host "🚀 Lancement du générateur Yeoman packagé" -ForegroundColor $Blue

# Détecter l'exécutable approprié
$executable = $null
if (Test-Path "generator-first-test-win.exe") {
    $executable = "generator-first-test-win.exe"
} elseif (Test-Path "generator-first-test-linux") {
    $executable = "generator-first-test-linux"
} elseif (Test-Path "generator-first-test-macos") {
    $executable = "generator-first-test-macos"
}

# Vérifier si l'exécutable existe
if (-not $executable -or -not (Test-Path $executable)) {
    Write-Host "❌ Erreur: Aucun exécutable trouvé" -ForegroundColor $Red
    Write-Host "💡 Fichiers disponibles:" -ForegroundColor $Yellow
    Get-ChildItem -Name "generator-first-test-*" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "   - $_" -ForegroundColor Gray
    }
    exit 1
}

# Rendre l'exécutable exécutable (Linux/Mac)
if ($IsLinux -or $IsMacOS) {
    chmod +x $executable
}

# Lancer le générateur
Write-Host "✅ Démarrage du générateur avec: $executable" -ForegroundColor $Green

try {
    & "./$executable"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Générateur terminé avec succès !" -ForegroundColor $Green
    } else {
        Write-Host "❌ Erreur lors de l'exécution du générateur (code: $LASTEXITCODE)" -ForegroundColor $Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur lors de l'exécution: $($_.Exception.Message)" -ForegroundColor $Red
    exit 1
}
`;

// documentation
const readmeContent = `# Générateur packagé

Ce dossier contient les exécutables du générateur packagé avec pkg.

## 🚀 Utilisation

### Windows
\`\`\`bash
# Double-cliquer sur run-generator.bat
# Ou dans PowerShell:
.\\run-generator.ps1
\`\`\`

### Linux/Mac
\`\`\`bash
# Rendre le script exécutable
chmod +x run-generator.sh

# Lancer le générateur
./run-generator.sh
\`\`\`

### Exécutable direct
\`\`\`bash
# Windows
./generator-first-test-win.exe

# Linux
./generator-first-test-linux

# macOS
./generator-first-test-macos
\`\`\`

## 📁 Fichiers inclus

- \`generator-first-test-*.exe\` : Exécutables pour chaque plateforme
- \`run-generator.sh\` : Script de lancement pour Linux/Mac
- \`run-generator.bat\` : Script de lancement pour Windows
- \`run-generator.ps1\` : Script PowerShell universel

## ✅ Avantages

- ✅ Pas besoin d'installer Node.js
- ✅ Pas besoin d'installer Yeoman
- ✅ Pas besoin d'installer les dépendances
- ✅ Exécution directe sur n'importe quelle machine
- ✅ Scripts de lancement automatiques

## 🔧 Développement

Pour reconstruire les exécutables :
\`\`\`bash
npm run build
\`\`\`
`;

// écrire les fichiers
try {
    // script shell
    fs.writeFileSync(path.join(distPath, 'run-generator.sh'), shellScript);
    fs.chmodSync(path.join(distPath, 'run-generator.sh'), 0o755);
    
    // script batch
    fs.writeFileSync(path.join(distPath, 'run-generator.bat'), batchScript);
    
    // script PowerShell
    fs.writeFileSync(path.join(distPath, 'run-generator.ps1'), powershellScript);
    
    // README
    fs.writeFileSync(path.join(distPath, 'README.md'), readmeContent);
    
    console.log('✅ Scripts de lancement créés avec succès dans le dossier dist/');
    console.log('📁 Fichiers créés:');
    console.log('   - run-generator.sh (Linux/Mac)');
    console.log('   - run-generator.bat (Windows)');
    console.log('   - run-generator.ps1 (PowerShell universel)');
    console.log('   - README.md (instructions d\'utilisation)');
    
} catch (error) {
    console.error('❌ Erreur lors de la création des scripts:', error.message);
    process.exit(1);
} 