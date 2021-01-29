# Scénario de tests


## Avant propos

Avant chaque set de tests, les collections de la base de données initale sont sauvegardé sous un autre nom. De nouvelle collections sont créée et les données nécessaires sont inséré.
Après chaque set de tests, les collections de tests sont supprimées et les collections initales sont rechargées.

## Page d'accueil

* But : vérifier si les événements sont correctement affichés sur la page d'accueil

* Cas de tests :
    * Avec une base de données vide
    * Avec une base de données contenant que des anciens événements
    * Avec une base de données contenant que un événement du jour
    * Avec une base de données contenant que un événement futur
    * Avec une base de données contenant les trois types d'événements

* Ce qui est vérifié :
    * Si les informations des événements doivent être présents ou non ainsi que leur exactitude
    * Si les liens sont correctes

* Remarques : Les tests automatiques sont pratiqués sans utilisateur connecté car cette page est accessible à tous.  


## S'enregistrer

* But : vérifier si les informations que les utilisateurs entrent pour se créer un compte sont correctement sauvées dans la base de données.

* Cas de tests :
    * L'utilisateur s'enregistre avec une addresse mail qui n'est pas encore présente dans la base de données
    * L'utilisateur essaie de s'enregistrer avec une addresse mail qui est déjà présente dans la base de données
    * L'utilisateur entre un numéro de téléphone
    * L'utilisateur n'entre pas de numéro de téléphone

* Ce qui est vérifié :
    * Si les informations entrées sont correcte dans la base de données (s'il n'y a pas de numéro de téléphone, le champ est présent mais vide)
    * Si l'utilisateur essaie de s'enregistrer avec une addresse mail déjà présente, il est redirigé vers la page d'enregistrement et un message d'erreur est affiché. La base de données n'a pas été modifiée.
    * Après un enregistrement réussi, l'utilisateur est amené à la page de description du site et son prénom est affiché.

* Remarques : L'exactitude des données est vérifiée directement dans la base de données.


## Connexion

* But : Vérifier la bonne connection d'un utilisateur. 

* Cas de tests :
    * L'utilisateur non connecté, veut se connecter depuis l'accueil
    * L'utilisateur non connecté cherche à faire une requête de type get
    * L'utilisateur non connecté fait une recherche depuis la barre de navigation
    * L'utilisateur ne se trompe pas de mot de passe
    * L'utilisateur se trompe de mot de passe
    * L'utilisateur utilise une addresse mail inexistante

* Ce qui est testé :
    * Pour chaque connection, l'utilisateur est redirigé vers la page dont il faisait la recherche (ou vers la page d'accueil s'il a directement demandé la page de login depuis l'url)
    * S'il entre un mauvais mot de passe ou une addresse mail inexistante, il est redirigé vers la page login avec un message d'erreur. S'il entre à nouveau un bon mot de passe, il sera correctement redirigé vers la page dont il faisait la recherche.

  
## Page de profil utilisateur

* But : vérifier si les profils sont correctement affichés en fonction des permissions

* Cas de tests :
    * L'utilisateur recherche son profil
    * L'utilisateur recherche le profil d'une autre personne
    * La personne organise des événements à venir
    * La personne participe à des événements à venir
    * La personne a organisé ou a participé à des événements passés

* Ce qui est testé :
    * Si les informations présentent doivent l'être ou non ainsi que leur exactitude
        * Si un utilisateur regarde son propre profil, il trouve son prénom, son nom, son addresse mail et son numéro de téléphone ainsi que les listes des événements passés comme futurs auquel il a participé et/ou qu'il a organisé.
        * Si un utilisateur regarde le profil d'un autre utilisateur, les informations affichées ne comportent que les informations personnelles hormis le numéro de téléphone, ainsi que la liste des événements organisés dans le futur.
    * Si les liens sont correctes


## Modification du profil

* But : vérifier si un profil est correctement modifié

* Cas de tests :
    * L'utilisateur change toutes les cases mais clique sur "retourner sur mon profil sans enregistrer les modifications)
    * L'utilisateur modifie ses informations personnelles
    * L'utilisateur modifie ses informations personnelles et entre un mauvais mot de passe
    * L'utilisateur modifie son addresse mail et utilise une déjà utilisée
    * L'utilisateur modifie son mot de passe
    * L'utilisateur modifie son mot de passe mais en entre un mauvais

* Ce qui est testé :
    * Si les informations présentes initialement sur la page sont correctes
    * Si les informations sont correctement modifié s'il le faut
    * Après sauvegarde des modifications des informations personnelles, la page redirigée est modifiée (vérification du titre)

* Remarque : L'exactitude des modifications est vérifiée directement dans la base de données.


## Création d'un événement

* But : vérifier si les informations que les utilisateurs entrent pour créer un événement sont correctement sauvées dans la base de données.

* Cas de tests :
    * L'utilisateur entre toutes les données
    * L'utilisateur ne met pas de description détaillée ni de remarques

* Ce qui est testé :
    * Si les informations entrées sont correcte dans la base de données (s'il n'y a pas de description ou de remarque, les champs sont présent mais vide)


* Remarque : L'exactitude des données est vérifiée directement dans la base de données.


## Page d'un événement
* But : vérifier si les événements sont correctement affichés en fonction des permissions

* Cas de tests :
    * L'utilisateur est le propriétaire et que l'événement est passé
    * L'utilisateur est le propriétaire et l'événement est aujourd'hui ou dans le futur
    * L'utilisateur est inscrit à l'événement et l'événement est passé
    * L'utilisateur est inscrit à l'événement et l'événement est aujourd'hui ou dans le futur
    * L'utilisateur n'est pas inscrit à l'événement et l'événement est passé
    * L'utilisateur n'est pas inscrit à l'événement, l'événement est aujourd'hui ou dans le futur et il n'est pas complet
    * L'utilisateur n'est pas inscrit à l'événement, l'événement est aujourd'hui ou dans le futur et il est complet

* Ce qui est testé :
    * Si les informations présentent doivent l'être ou non ainsi que leur exactitude
        * Les informations relatives à l'événement :
            * Le prénom et nom de l'organisateur
            * Le nombre de places disponible / le nombre de places restantes
            * La date
            * Le lieu
            * Si l'utilisateur est l'organisateur de l'événement, la description brève est affichée, sinon la section description brève n'est pas présente
            * S'il y a une description, elle est affichée, sinon la section description n'est pas présente
            * S'il n'y a des remarques, elles sont affichées, sinon la section remarques n'est pas présente
            * Si l'utilisateur est l'organisateur de l'événement, les personnes participants à l'événement sont affiché, sinon la section n'est pas présente
        * Les options :
            * Si l'utilisateur est l'organisateur et que l'événement n'est pas passé, les options du·de la créateurice
            * Si l'utilisateur est déjà inscrit à l'événement et que l'événement n'est pas passé, la possibilité de modifier son inscription
            * Si l'utilisateur veut s'incrire, que l'événement n'est pas passé et qu'il n'est pas complet, la possibilité de s'incrire
            * Si l'utilisateur veut s'incrire, que l'événement n'est pas passé et qu'il n'est pas complet, un message comme quoi l'événement est complet
            * Si l'événement est passé et que l'utilisateur n'est pas le créateur, un message comme quoi l'événement est passé
    * Si les liens sont correctes et mènent à la bonne requête

* Remarques : L'exactitude des modifications est vérifiée directement dans la base de données.
Certains tests supplémentaires peuvent être effectué. Ceux-ci sont repris dans la section [tests supplémentaires à la main](#tests-supplémentaires-à-la-main)


## Modification d'un événement

* But : vérifier si un profil est correctement modifié

* Cas de tests :
    * Si c'est un ancien événement (mène à une page 404)
    * Si la personne n'est pas propriétaire de l'événement (mène à une page 403)
    * L'utilisateur change toutes les cases mais clique sur "retourner sur la page de l'événement sans enregistrer les modifications"
    * L'utilisateur change toutes les cases

* Ce qui est testé :
    * Si les informations présentes initialement sur la page sont correctes.
    * Si les informations sont correctement modifié s'il le faut
    * Après sauvegarde des modifications, la page redirigée est modifiée (vérification du titre)

* Remarque : L'exactitude des modifications est vérifiée directement dans la base de données. Certains tests supplémentaires peuvent être effectué. Ceux-ci sont repris dans la section [tests supplémentaires à la main](#tests-supplémentaires-à-la-main)


## Recherche

* But : vérifier que la recherche fonctionne

* Cas de tests :
    * Le mot recherché ne se trouve nulle par
    * Le mot recherché est uniquement trouvé dans les utilisateurs (par exemple un utilisateur qui est auteur d'aucun événement)
    * Le mot recerché est uniquement trouvé dans les événements (par exemple un mot qui ne se trouve que dans les descriptions)
    * Le mot recherché est trouvé dans les utilisateurs et les événements (par exemple un utilisateur qui est également auteur d'un événement)

* Remarque : La fonction de recherche est surtout à tester manuellement en fonction des résultats voulu. 


## Les pages inexistantes

* But : vérifier que si les pages ne sont pas trouvées, renvoie la page error 404

* Cas de tests :
    * non connecté
    * connecté

* Remarques : Les requêtes pour les pages d'événements avec une id d'événement ne se trouvant pas dans la base de données, vont demander de se connecter avant de dire que la page demandée n'existe pas. De même pour les d'édition d'événement ou de profile. Par conséquent, ces tests sont uniquement disponible quand l'utilisateur est connecté.
Les pages `event.html`, `editEvent.html`, `profile.html`, `main.html` et `searchResult.html` ne sont également pas accessible au public.


## Tests de sécurité

* But : vérifier que les utilisateurs n'ont pas accès à certaines requêtes lorsqu'ils ne sont pas connectés ou qu'ils n'ont pas les permissions requises

* Cas de tests :
    * Un utilisateur non connecté essaie de modifier un mot de passe : `error 401 editPassword (not connected)`
    * Un utilisateur non connecté essaie de modifier un profil : `error 401 updateProfile (not connected)`
    * Un utilisateur non connecté essaie de créer un événement : `error 401 createEvent (not connected)`
    * Un utilisateur non connecté essaie de modifier un événement : `error 403 updateEvent (not connected)`
    * Un utilisateur connecté essaie de modifier un événement qu'il n'organise pas: `error 403 updateEvent (connected but not owner)`
    * Un organisateur essaie de modifier un de ses anciens événements : `error 403 updateEvent (owner but last event)`
    * Un utilisateur non connecté essaie de supprimer un événement : error `403 eventDeletion (not connected)`
    * Un utilisateur connecté essaie de supprimer un événement qu'il n'organise pas : `error 403 eventDeletion (connected but not owner)`
    * Un organisateur essaie de supprimer un de ses anciens événements: `error 403 eventDeletion (owner but last event)`
    * Un utilisateur non connecté essaie de s'inscrire à un événement : `error 401 eventInscription (not connected)`
    * Un utilisateur connecté essaie de s'inscrire à un ancien événement : `error 403 eventInscription (connected but last event)`
    * Un utilisateur non connecté essaie de modifier son inscription à un événement : `error 401 eventModificationInscription (not connected)`
    * Un utilisateur non inscrit essaie de modifier son inscription à un événement : `error 403 eventModificationInscription (connected but not inscribe)`
    * Un utilisateur inscrit essaie de modifier son inscription à un événement passé : `error 403 eventModificationInscription (connected but last event)`
    * Un utilisateur non connecté essaie de supprimer son inscription à un événement : `error 401 eventUnsubscribe (not connected)`
    * Un utilisateur non inscrit essaie de supprimer son inscription à un événement : `error 403 eventUnsubscribe (connected but not inscribe)`
    * Un utilisateur inscrit essaie de supprimer son inscription à un événement : `error 403 eventUnsubscribe (connected but last event)`



## Tests supplémentaires à la main

Lors ce qu'un utilisateur s'inscrit ou modifie son insciption à un événement (en modifiant le nombre de places demandées ou en se désincrivant), les pages `event.html` et `editEvent.html` des autres utilisateurs sont mis à jour avec de nouvelles valeurs. Il en est de même lorsqu'un organisateur modifie le nombre de places à son événement.

Pour tester ces cas, il faut plusieurs fenêtres ouvertes sur la même page `event.html` avec plusieurs utilisateurs et/ou l'organisateur sur la page `editEvent.html` de cet événement.

* Quelques scénarios de tests intéressant
    * Une personne non inscrite se trouvant sur la page d'un événement complet. Une personne se désiste, une personne modifie son inscription vers le bas ou l'organisateur augmente le nombre de place. La personne non inscrite voit directement apparaître les options d'inscriptions sans recharger la page.
    * Si une personne prend les places restantes, une personne non inscrite verra directement apparaître que l'événement est complet.
    