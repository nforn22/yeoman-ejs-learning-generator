const path = require('path');
const assert = require('yeoman-assert');
const fs = require('fs');

let helpers;

before(async () => {
    helpers = (await import('yeoman-test')).default;
})

describe ('Mon générateur :first-test', () => {
    it ('crée un fihcier README.md avec le bon contenu', async () => {
        await helpers
        .run(path.join(__dirname, '../generators/app')) // chemin vers le générateur
        .withPrompts({projectName: 'ProjetTest'});

        assert.file('README.md'); // vérifie que le fichier est créé
        assert.fileContent('README.md', '# ProjetTest') // vérifie le contenu
    });
  });