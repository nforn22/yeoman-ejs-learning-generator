#!/bin/bash
# script d'installation des dépendances pour le générateur portable

if ! command -v node &> /dev/null
then
    echo "Node.js n'est pas installé. Veuillez l'installer puis relancez ce script."
    exit 1
fi

if ! command -v npm &> /dev/null
then
    echo "npm n'est pas installé. Veuillez l'installer puis relancez ce script."
    exit 1
fi

echo "Installation des dépendances Node.js..."
npm install

echo "✅ Installation terminée. Vous pouvez lancer ./run-generator.sh" 