# Générateur de projet (Yeoman portable)

Ce générateur crée automatiquement un squelette de projet Node.js avec README, package.json et un fichier d'entrée.

## Prérequis
- Node.js (v16 ou plus)
- npm

## Installation (à faire une seule fois)
```bash
./install.sh
```
*Sous Windows :* `install.bat`

## Génération d'un projet
```bash
./run-generator.sh
```
*Sous Windows :* `run-generator.bat`

Répondez aux questions dans le terminal. Les fichiers seront créés dans le dossier courant.

## Conseils
- Lancez le générateur dans un dossier vide pour éviter les conflits.
- Si un fichier existe déjà, Yeoman vous demandera si vous voulez l'écraser.
- Ajoutez `.DS_Store` à votre `.gitignore` pour éviter de versionner ce fichier système MacOS.

```
# .gitignore
.DS_Store
``` 