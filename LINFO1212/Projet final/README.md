Bonjour,

Afin de lancer notre site web, placez-vous dans le dossier courant où se trouve le fichier `server.js` et ouvrez un terminal de commandes dans ce même dossier.

Ensuite, exécutez la commande `node server.js` et suivez le lien https://localhost:8080/.

Les tables sont créées automatiquement au lancement du site si elles n'existent pas. Cependant, celles-ci seront vides. 
Si vous souhaitez visualiser un exemple, vous pouvez importer deux fichiers json fournis par nos soins grâce aux commandes suivantes (à exécuter avant le lancement du site) :

1. Tapez `mongo` afin de lancer l'interface
2. Ouvrez un second terminal, placez-vous dans le dossier courant où se trouve le fichier `users.json`
4. Entrez `mongoimport -d calendar -c users users.json` 
3. Entrez `mongoimport -d calendar -c events events.json` dans ce même terminal

Vous pouvez vous connecter avec les utilisateurs suivants :

| Email                   |  Mot de passe   |
|:----------------------: |:--------------: |
| `test@test`               |     test        |
| `john.smith@gmail.com`    |     john        |
| `jean.denis@gmail.com`    |     jean        |
| `sofia.valdez@gmail.com`  |     sofia       |

&nbsp;

Pour exécuter les tests, lancez comme précédent le serveur. Ensuite, ouvrez un nouveau terminal dans le même dossier et exécuter la commande `npm test`. Lors des tests, votres base de données est sauvegardée et une temporaire est créée uniquement pour les tests.
Avant d'exécuter les tests, merci de vous rendre sur http://chromedriver.storage.googleapis.com/index.html et de télécharger le chromedriver compatible avec votre version de navigateur. (veuillez préférer les versions supérieur à la version 87.0.4280.88 car des bugs ont été rencontré avec des versions antérieures)
Mettez le fichier exe dans le dossier courant.

L'équipe de production L
