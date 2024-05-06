# oboardgame-back

## Installation

- Création de la base de données :
```js
// Se connecter à la base de données
psql -U postgres

// Créer un utilisateur avec son mot de passe
CREATE USER oboardgame WITH PASSWORD 'oboardgame';
// Créer la base de donnée en l'associant à son utilisateur
CREATE DATABASE oboardgame WITH OWNER oboardgame;
```
- Remplissage la base de données

```bash
npm run resetDB
```

- Installer les dépendances :

```bash
npm install
```

- Copier le .env.example puis renseigner les variables d'environnement:

```bash
cp .env.example .env
```

- Lancer l'api :

```bash
npm run dev
```