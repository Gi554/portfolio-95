# Portfolio Arcade

Un bureau Windows 95 avec une navigation légère par onglets et des applications rétro.

## Lancer en local

Double-cliquer sur `Lancer-portfolio.cmd`, puis ouvrir http://127.0.0.1:5173/.
Ou exécuter `npm start` dans ce dossier (Node.js 20 ou supérieur). Cette commande génère le build puis lance le serveur. Fermer le terminal ou utiliser Ctrl+C pour arrêter.

## Structure et développement

- `src/` : fichiers sources HTML, CSS et JavaScript à modifier.
- `scripts/build.cjs` : vérifie la syntaxe JavaScript et génère un dossier `dist/` propre à partir des sources.
- `dist/` : résultat généré, prêt à publier et ignoré par Git. Ne pas modifier directement.
- `server.cjs` : serveur local.

`npm run dev` sert directement les sources : actualiser le navigateur après une modification.
`npm run build` génère la version à publier. Aucun paquet externe n'est nécessaire.

## Netlify

Importer le dépôt GitHub. `netlify.toml` définit la commande `npm run build` et le dossier publié `dist`.
Netlify reconstruit le site à chaque déploiement à partir de `src`.

## Applications

- Projets, Bloc-notes, contact et terminal du portfolio.
- Paint avec export PNG.
- Démineur : 9 × 9, premier clic sûr.
- Snake : flèches ou ZQSD, espace pour la pause, commandes tactiles sur mobile.
- Memory : huit paires, compteur de coups, nouvelle partie.
- Tetris : rotation, chute rapide, lignes, score et commandes tactiles.
- Bug Hunter : six défis JavaScript avec correction expliquée et résultat final.
- Super Dev : jeu de plateforme original inspiré des classiques, pièces, robots, trois vies et commandes tactiles.

Les projets et coordonnées restent à renseigner.
Les derniers ajouts (centre de contrôle, cartes d’applications, Inspecteur) ont été retirés.
