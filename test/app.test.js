import path from 'path';
import { expect, describe, it, beforeAll, beforeEach } from 'vitest';
import assert from 'yeoman-assert';
import fs from 'fs';


let helpers;

// s'éxécute une seule fois avant les tests
beforeAll(async () => {
    helpers = (await import('yeoman-test')).default;
});

// test du générateur avec des données prédéfinies
// pour s'assurer que les templates EJS fonctionnent correctement
describe('Mon générateur : tests avancés', () => {
    // données de test qui simulent les réponses utilisateur
    // les valeurs seront passées aux templates EJS
    const testPrompts = {
        projectName: 'ProjetTest',
        description: 'Projet de test',
        author: 'John Doe',
        version: '2.0.0'
    };

    // s'exécute avant chaque test
    // lance le générateur avec les données de test
    // crée un nouveau dossier temporiaire pour chaque test
    beforeEach(async () => {
        await helpers
            .run(path.join(__dirname, '../generators/app'))
            .withPrompts(testPrompts);
    });

    describe('Création des fichiers', () => {
        it('crée tous les fichiers nécessaires', () => {
            // assert.file() vérifie que ces fichiers existent
            assert.file([
                'package.json',
                'README.md',
                'src/index.js'
            ]);
        });
    });

    // vérifie que les variables EJS sont correctement remplacées
    // dans le fichier package.json généré
    describe('Contenu du package.json', () => {
        it('contient le nom du projet correct', () => {
            // assert.fileContent() vérifie qu'une chaîne est présente dans le fichier
            // vérifie que <%= projectName %> a été remplacé par 'ProjetTest'
            assert.fileContent('package.json', '"name": "ProjetTest"');
        });

        it('contient la version correcte', () => {
            // vérifie que <%= version %> = '2.0.0'
            assert.fileContent('package.json', '"version": "2.0.0"');
        });

        it('contient la description correcte', () => {
            // vérifie que <%= description %> = 'Projet de test'
            assert.fileContent('package.json', '"description": "Projet de test"');
        });

        it('contient l\'auteur correct', () => {
            // vérifie que <%= author %> = 'John Doe'
            assert.fileContent('package.json', '"author": "John Doe"');
        });

        it('contient le bon point d\'entrée', () => {
            // vérifie que le main pointe vers le fichier généré
            assert.fileContent('package.json', '"main": "src/index.js"');
        });

        it('a un JSON valide', () => {
            // test de validité JSON : si JSON.parse() ne lance pas d'erreur, c'est valide
            const content = fs.readFileSync('package.json', 'utf8');
            expect(() => JSON.parse(content)).not.to.throw();
        });
    });

    describe('Contenu du README.md', () => {
        it('contient le titre avec le nom du projet', () => {
            // vérifie que le titre principal contient <%= projectName %>
            assert.fileContent('README.md', '# ProjetTest');
        });

        it('contient la description du projet', () => {
            // vérifie que <%= description %> apparaît dans le README
            assert.fileContent('README.md', 'Projet de test');
        });

        it('contient le nom de l\'auteur', () => {
            // vérifie que <%= author %> est affiché correctement
            assert.fileContent('README.md', 'Créé par **John Doe**');
        });

        it('contient les références multiples au projet', () => {
            // vérifie que <%= projectName %> apparaît plusieurs fois
            // dans différents contextes du README
            assert.fileContent('README.md', 'Ce projet **ProjetTest**');
            assert.fileContent('README.md', '*Généré automatiquement pour ProjetTest*');
        });
    });

    // vérifie que le fichier JS généré :
    // - contient les bonnes variables remplacées
    // - a une syntaxe JS valide
    // - crée une classe avec le bon nom (ex: ProjetTest -> ProjetTestApp)
    describe('Contenu du src/index.js', () => {
        it('contient le nom du projet dans les commentaires', () => {
            assert.fileContent('src/index.js', 'Point d\'entrée pour ProjetTest');
        });

        it('contient le nom du projet dans le console.log', () => {
            assert.fileContent('src/index.js', 'Démarrage de ProjetTest');
        });

        it('contient une classe avec le nom correct', () => {
            assert.fileContent('src/index.js', 'class ProjetTestApp');
        });

        it('contient l\'instanciation de la classe', () => {
            assert.fileContent('src/index.js', 'const app = new ProjetTestApp()');
        });

        it('a une syntaxe JS valide', () => {
            // test de validité JS basique
            const content = fs.readFileSync('src/index.js', 'utf8');
            // vérifie la présence d'éléments JS essentiels
            expect(content).to.match(/class \w+App/);  // regex pour une classe se terminant par 'App'
            expect(content).to.include('export default');  // export ES modules
        });
    });

    // vérifie que les mêmes valeurs sont utilisées
    // dans tous les fichiers générés (pas d'incohérence)
    describe('Cohérence entre les fichiers', () => {
        it('utilise le même nom de projet dans tous les fichiers', () => {
            // lecture des fichiers générés pour vérification croisée
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const readme = fs.readFileSync('README.md', 'utf8');
            const indexJs = fs.readFileSync('src/index.js', 'utf8');

            // vérifie que 'ProjetTest' apparaît partout
            expect(packageJson.name).to.equal('ProjetTest');
            expect(readme).to.include('ProjetTest');
            expect(indexJs).to.include('ProjetTest');
        });

        it('utilise la même description dans package.json et README', () => {
            // vérifie la cohérence entre package.json et README
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const readme = fs.readFileSync('README.md', 'utf8');

            expect(packageJson.description).to.equal('Projet de test');
            expect(readme).to.include('Projet de test');
        });
    });

    // teste le générateur avec différents scénarios
    describe('Tests avec différentes valeurs', () => {
        it('gère correctement les noms avec des caractères spéciaux', async () => {
            // test avec un nom contenant des tirets
            // vérifie que la transformation fonctionne
            await helpers
                .run(path.join(__dirname, '../generators/app'))
                .withPrompts({
                    projectName: 'un-autre-projet',
                    description: 'Un autre projet',
                    author: 'nforn',
                    version: '1.0.0'
                });

            // vérifie que les tirets sont gérés correctement
            assert.fileContent('package.json', '"name": "un-autre-projet"');
            assert.fileContent('README.md', '# un-autre-projet');
            assert.fileContent('src/index.js', 'Démarrage de un-autre-projet');
        });

        it('gère les valeurs par défaut', async () => {
            // test sans réponses utilisateur
            await helpers
                .run(path.join(__dirname, '../generators/app'))
                .withPrompts({});

            // vérifie que les valeurs par défaut sont utilisées
            assert.fileContent('package.json', '"name": "mon-projet"');
            assert.fileContent('README.md', 'Une description par défaut');
            assert.fileContent('package.json', '"author": "John Doe"');
        });
    });
});