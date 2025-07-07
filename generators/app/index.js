import Generator from 'yeoman-generator';

export default class extends Generator {
    async prompting() {
        try {
            const answers = await this.prompt([
                {
                    type: 'input',
                    name: 'projectName',
                    message: 'Quel est le nom du projet?',
                    default: 'mon-projet'
                },
                {
                    type: 'input',
                    name: 'description',
                    message: 'Description du projet?',
                    default: 'Une description par défaut'
                },
                {
                    type: 'input',
                    name: 'author',
                    message: 'Nom de l\'auteur?',
                    default: 'John Doe'
                },
                {
                    type: 'input',
                    name: 'version',
                    message: 'Version initiale?',
                    default: '1.0.0'
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

        this.fs.copyTpl(
            this.templatePath('src/index.ejs'),
            this.destinationPath('src/index.js'),
            {
                projectName: this.answers.projectName
            }
        );
    }

    end() {
        this.log('Générateur terminé');
    }
}