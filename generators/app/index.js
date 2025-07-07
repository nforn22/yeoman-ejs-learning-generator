const Generator = require('yeoman-generator').default;

module.exports = class extends Generator {
    async prompting() {
        try {
          const answers = await this.prompt([
            {
              type: 'input',
              name: 'projectName',
              message: 'Quel est le nom du projet?',
              default: 'mon-projet'
            },
          ]);
          this.answers = answers;
        } catch (error) {
          this.log('Une erreur est survenue lors du prompt:', error);
        }
      }

    writing() {
        this.log(`Création d'un fichier README pour ${this.answers.projectName}`);
        this.fs.write(
          this.destinationPath('README.md'),
          `# ${this.answers.projectName}`
        );
      }

    end() {
        this.log('Generateur terminé')
    }
}