#!/usr/bin/env node

/**
 * point d'entrée pour le générateur packagé
 * ce fichier sera compilé en exécutable avec pkg
 */

import { createEnv } from 'yeoman-environment';
import path from 'path';
import { fileURLToPath } from 'url';

// chemin du répertoire courant (nécessaire pour ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// créer l'environnement Yeoman
const env = createEnv();

// enregistrer notre générateur
env.register(path.resolve(__dirname, './generators/app'), 'generator-first-test:app');

// lancer le générateur
env.run('generator-first-test:app', (err) => {
    if (err) {
        console.error('Erreur lors de l\'exécution du générateur:', err);
        process.exit(1);
    }
    console.log('✅ Générateur exécuté avec succès !');
}); 