import Generator from 'yeoman-generator';
import fs from 'fs';
import path from 'path';

export default class extends Generator {
    async prompting() {
        try {
            const answers = await this.prompt([
                {
                    type: 'input',
                    name: 'projectName',
                    message: 'Nom du projet ?',
                    default: 'mon-projet'
                },
                {
                    type: 'input',
                    name: 'description',
                    message: 'Description du projet ?',
                    default: 'Une description par défaut'
                },
                {
                    type: 'input',
                    name: 'version',
                    message: 'Version initiale ?',
                    default: '1.0.0'
                },
                {
                    type: 'list',
                    name: 'projectType',
                    message: 'Que souhaitez-vous générer ?',
                    choices: [
                        { name: 'Frontend uniquement', value: 'frontend' },
                        { name: 'Backend uniquement', value: 'backend' },
                        { name: 'Frontend & Backend (monorepo)', value: 'fullstack' }
                    ],
                    default: 'frontend'
                },
                {
                    type: 'list',
                    name: 'frontendStack',
                    message: 'Quelle technologie frontend ?',
                    choices: ['React', 'Vue', 'Angular', 'Svelte', 'Vanilla JS'],
                    when: answers => answers.projectType === 'frontend' || answers.projectType === 'fullstack'
                },
                {
                    type: 'list',
                    name: 'backendStack',
                    message: 'Quelle technologie backend ?',
                    choices: ['Express', 'Koa', 'Fastify', 'NestJS'],
                    when: answers => answers.projectType === 'backend' || answers.projectType === 'fullstack'
                },
                {
                    type: 'confirm',
                    name: 'useTypescriptFrontend',
                    message: 'Utiliser TypeScript pour le frontend ?',
                    default: true,
                    when: answers => answers.projectType === 'frontend' || answers.projectType === 'fullstack'
                },
                {
                    type: 'confirm',
                    name: 'useTypescriptBackend',
                    message: 'Utiliser TypeScript pour le backend ?',
                    default: true,
                    when: answers => answers.projectType === 'backend' || answers.projectType === 'fullstack'
                },
                {
                    type: 'list',
                    name: 'packageManager',
                    message: 'Quel gestionnaire de paquets ?',
                    choices: ['npm', 'yarn'],
                    default: 'npm'
                },
                {
                    type: 'confirm',
                    name: 'initGit',
                    message: 'Initialiser un dépôt git ?',
                    default: true
                },
                {
                    type: 'list',
                    name: 'linter',
                    message: 'Inclure un linter ou un formatter ?',
                    choices: ['ESLint', 'Prettier', 'Rien'],
                    default: 'ESLint'
                },
                {
                    type: 'list',
                    name: 'testFramework',
                    message: 'Framework de tests ?',
                    choices: ['Jest', 'Vitest', 'Mocha', 'Rien'],
                    default: 'Jest'
                },
                {
                    type: 'list',
                    name: 'license',
                    message: 'Licence du projet ?',
                    choices: ['MIT', 'Apache', 'GPL', 'Aucune'],
                    default: 'MIT'
                },
                {
                    type: 'confirm',
                    name: 'detailedReadme',
                    message: 'Générer un README ?',
                    default: true
                }
            ]);
            this.answers = answers;
        } catch (error) {
            this.log.error('Une erreur est survenue lors du prompt:', error);
            throw error;
        }
    }

    writing() {
        this.log(`Création du projet ${this.answers.projectName}`);
        
        // 1) crée le dossier src s'il n'existe pas
        const destSrc = this.destinationPath('src');
        if (!fs.existsSync(destSrc)) {
            fs.mkdirSync(destSrc, { recursive: true });
        }

        // 2) copie le template
        this.fs.copyTpl(
            this.templatePath('src/index.ejs'),
            this.destinationPath('src/index.js'),
            { projectName: this.answers.projectName }
        );

        // copie des templates avec substitution des variables
        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('package.json'),
            {
                projectName: this.answers.projectName,
                description: this.answers.description,
                author: this.answers.author,
                version: this.answers.version
            }
        );

        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath('README.md'),
            {
                projectName: this.answers.projectName,
                description: this.answers.description,
                author: this.answers.author
            }
        );
    }

    end() {
        this.log('Générateur terminé');
    }
}