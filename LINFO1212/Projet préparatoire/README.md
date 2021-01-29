Bonjour,

Afin de lancer notre site web, placez-vous dans le dossier courant où se trouve le fichier `serveur.js` et ouvrez un terminal de commandes dans ce même dossier.

Ensuite, exécutez la commande `node serveur.js` et suivez le lien https://localhost:8080/.

Les tables sont créées automatiquement au lancement du site si elles n'existent pas. Cependant, celles-ci seront vides. 
Si vous souhaitez visualiser un exemple, vous pouvez importer deux fichiers json fournis par nos soins grâce aux commandes suivantes (à exécuter avant le lancement du site) :

1. Tapez `mongo` afin de lancer l'interface
2. Ouvrez un second terminal et entrez `mongoimport -d lln -c users users.json` 
3. Entrez `mongoimport -d lln -c incidents incidents.json` dans ce même terminal

Vous pouvez vous connecter avec l'utilisateur qui a pour nom `Test` et comme mot de passe `test`

L'équipe de production L
