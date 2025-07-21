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
                    message: 'Nom du projet :',
                    default: 'mon-projet'
                },
                {
                    type: 'input',
                    name: 'description',
                    message: 'Brève description du projet :',
                    default: 'Une description par défaut'
                },
                {
                    type: 'input',
                    name: 'version',
                    message: 'Version initiale (par défaut : 1.0.0) :',
                    default: '1.0.0'
                },
                {
                    type: 'list',
                    name: 'projectType',
                    message: 'Quel type de projet souhaitez-vous générer ?',
                    choices: [
                        { name: 'Frontend', value: 'frontend' },
                        { name: 'Backend', value: 'backend' },
                        { name: 'Frontend & Backend (monorepo)', value: 'fullstack' }
                    ],
                    default: 'frontend'
                },
                {
                    type: 'list',
                    name: 'frontendStack',
                    message: 'Quel framework frontend souhaitez-vous utiliser ?',
                    choices: ['React', 'Vue', 'Angular', 'Svelte', 'Vanilla JS'],
                    when: answers => answers.projectType === 'frontend' || answers.projectType === 'fullstack'
                },
                {
                    type: 'list',
                    name: 'backendStack',
                    message: 'Quel framework backend souhaitez-vous utiliser ?',
                    choices: ['Express', 'Koa', 'Fastify', 'NestJS'],
                    when: answers => answers.projectType === 'backend' || answers.projectType === 'fullstack'
                },
                {
                    type: 'confirm',
                    name: 'useTypescriptFrontend',
                    message: 'Souhaitez-vous utiliser TypeScript ?',
                    default: true,
                    when: answers => answers.projectType === 'frontend' || answers.projectType === 'fullstack'
                },
                {
                    type: 'confirm',
                    name: 'useTypescriptBackend',
                    message: 'Souhaitez-vous utiliser TypeScript ?',
                    default: true,
                    when: answers => answers.projectType === 'backend' || answers.projectType === 'fullstack'
                },
                {
                    type: 'list',
                    name: 'packageManager',
                    message: 'Gestionnaire de paquets à utiliser :',
                    choices: ['npm', 'yarn'],
                    default: 'npm'
                },
                {
                    type: 'confirm',
                    name: 'initGit',
                    message: 'Souhaitez-vous initialiser un dépôt Git ?',
                    default: true
                },
                {
                    type: 'list',
                    name: 'linter',
                    message: 'Souhaitez-vous ajouter un outil de linting ou de formatage ?',
                    choices: ['ESLint', 'Prettier', 'Rien'],
                    default: 'ESLint'
                },
                {
                    type: 'list',
                    name: 'testFramework',
                    message: 'Souhaitez-vous utiliser un framework de test ?',
                    choices: ['Jest', 'Vitest', 'Mocha', 'Rien'],
                    default: 'Jest'
                },
                {
                    type: 'list',
                    name: 'license',
                    message: 'Souhaitez-vous appliquer une licence ?',
                    choices: ['MIT', 'Apache', 'GPL', 'Aucune'],
                    default: 'MIT'
                },
                {
                    type: 'confirm',
                    name: 'detailedReadme',
                    message: 'Générer un fichier README ? ',
                    default: true
                },
                {
                    type: 'input',
                    name: 'author',
                    message: 'Nom de l\'auteur :',
                    default: 'Développeur'
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

        // génération de la structure de dossiers selon le type de projet
        if (this.answers.projectType === 'frontend') {
            this.fs.ensureDir(this.destinationPath('src'));
            this._generateFrontendFiles('.');
        }
        if (this.answers.projectType === 'backend') {
            this.fs.ensureDir(this.destinationPath('src'));
            this.fs.ensureDir(this.destinationPath('routes'));
            this.fs.ensureDir(this.destinationPath('middleware'));
            this.fs.ensureDir(this.destinationPath('config'));
            this._generateBackendFiles('.');
        }
        if (this.answers.projectType === 'fullstack') {
            this.fs.ensureDir(this.destinationPath('backend/src'));
            this.fs.ensureDir(this.destinationPath('backend/routes'));
            this.fs.ensureDir(this.destinationPath('backend/middleware'));
            this.fs.ensureDir(this.destinationPath('backend/config'));
            this.fs.ensureDir(this.destinationPath('frontend/src'));
            this._generateFrontendFiles('frontend');
            this._generateBackendFiles('backend');
        }
    }

    _generateFrontendFiles(baseDir) {
        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath(path.join(baseDir, 'package.json')),
            {
                projectName: this.answers.projectName,
                description: this.answers.description,
                version: this.answers.version,
                license: this.answers.license,
                author: this.answers.author
            }
        );

        if (this.answers.detailedReadme) {
            this.fs.copyTpl(
                this.templatePath('README.md'),
                this.destinationPath(path.join(baseDir, 'README.md')),
                {
                    projectName: this.answers.projectName,
                    description: this.answers.description,
                    author: this.answers.author
                }
            );
        }

        const ext = this.answers.useTypescriptFrontend ? 'ts' : 'js';
        this.fs.write(
            this.destinationPath(path.join(baseDir, `src/index.${ext}`)),
            `// Point d'entrée frontend\nconsole.log('Bienvenue sur ${this.answers.projectName} !');\n`
        );

        this.fs.copy(
            this.templatePath('gitignore'),
            this.destinationPath(path.join(baseDir, '.gitignore'))
        );

        if (this.answers.useTypescriptFrontend) {
            this.fs.copy(
                this.templatePath('tsconfig.json'),
                this.destinationPath(path.join(baseDir, 'tsconfig.json'))
            );
        }
    }

    _generateBackendFiles(baseDir) {
        // génére les fichiers selon le framework backend choisi
        const backendStack = this.answers.backendStack?.toLowerCase();
        
        if (backendStack === 'express') {
            this._generateExpressFiles(baseDir);
        } else if (backendStack === 'koa') {
            this._generateKoaFiles(baseDir);
        } else if (backendStack === 'fastify') {
            this._generateFastifyFiles(baseDir);
        } else if (backendStack === 'nestjs') {
            this._generateNestJSFiles(baseDir);
        } else {
            // fallback pour un backend générique
            this._generateGenericBackendFiles(baseDir);
        }

        // fichiers communs
        this.fs.copy(
            this.templatePath('gitignore'),
            this.destinationPath(path.join(baseDir, '.gitignore'))
        );

        if (this.answers.useTypescriptBackend) {
            this.fs.copy(
                this.templatePath('tsconfig.json'),
                this.destinationPath(path.join(baseDir, 'tsconfig.json'))
            );
        }
    }

    _generateExpressFiles(baseDir) {
        // package.json spécifique Express
        this.fs.copyTpl(
            this.templatePath('backend/express/package.json'),
            this.destinationPath(path.join(baseDir, 'package.json')),
            {
                projectName: this.answers.projectName,
                description: this.answers.description,
                version: this.answers.version,
                license: this.answers.license,
                author: this.answers.author,
                useTypescriptBackend: this.answers.useTypescriptBackend,
                testFramework: this.answers.testFramework
            }
        );

        // README spécifique
        if (this.answers.detailedReadme) {
            this.fs.copyTpl(
                this.templatePath('README.md'),
                this.destinationPath(path.join(baseDir, 'README.md')),
                {
                    projectName: this.answers.projectName,
                    description: this.answers.description,
                    author: this.answers.author
                }
            );
        }

        // fichier principal Express
        this.fs.copyTpl(
            this.templatePath('backend/express/src/index.ejs'),
            this.destinationPath(path.join(baseDir, 'src/index.js')),
            {
                projectName: this.answers.projectName,
                version: this.answers.version,
                author: this.answers.author
            }
        );

        // configuration
        this.fs.copyTpl(
            this.templatePath('backend/express/config/app.ejs'),
            this.destinationPath(path.join(baseDir, 'config/app.js')),
            {
                projectName: this.answers.projectName
            }
        );

        // routes
        this.fs.copyTpl(
            this.templatePath('backend/express/routes/index.ejs'),
            this.destinationPath(path.join(baseDir, 'routes/index.js')),
            {
                projectName: this.answers.projectName,
                version: this.answers.version
            }
        );

        // middleware
        this.fs.copyTpl(
            this.templatePath('backend/express/middleware/errorHandler.ejs'),
            this.destinationPath(path.join(baseDir, 'middleware/errorHandler.js')),
            {}
        );

        // fichier .env.example
        this.fs.copyTpl(
            this.templatePath('backend/express/env.example'),
            this.destinationPath(path.join(baseDir, '.env.example')),
            {
                projectName: this.answers.projectName
            }
        );
    }

    _generateKoaFiles(baseDir) {
        // TODO: Implémenter la génération pour Koa
        this._generateGenericBackendFiles(baseDir);
    }

    _generateFastifyFiles(baseDir) {
        // TODO: Implémenter la génération pour Fastify
        this._generateGenericBackendFiles(baseDir);
    }

    _generateNestJSFiles(baseDir) {
        // TODO: Implémenter la génération pour NestJS
        this._generateGenericBackendFiles(baseDir);
    }

    _generateGenericBackendFiles(baseDir) {
        // fallback pour un backend générique
        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath(path.join(baseDir, 'package.json')),
            {
                projectName: this.answers.projectName,
                description: this.answers.description,
                version: this.answers.version,
                license: this.answers.license,
                author: this.answers.author
            }
        );

        if (this.answers.detailedReadme) {
            this.fs.copyTpl(
                this.templatePath('README.md'),
                this.destinationPath(path.join(baseDir, 'README.md')),
                {
                    projectName: this.answers.projectName,
                    description: this.answers.description,
                    author: this.answers.author
                }
            );
        }

        const ext = this.answers.useTypescriptBackend ? 'ts' : 'js';
        this.fs.write(
            this.destinationPath(path.join(baseDir, `src/index.${ext}`)),
            `// Point d'entrée backend\nconsole.log('Bienvenue sur ${this.answers.projectName} !');\n`
        );
    }

    end() {
        this.log('Générateur terminé');
    }
}