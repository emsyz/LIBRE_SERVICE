F A C E C L A I M . P O U R . V O S . F O R U M S
version non commentée ici (déconseillée si vous découvrez le code)
https://github.com/emsyz/LIBRE_SERVICE/blob/main/TUMBLR/greendandgold/modifiable_compresse.html

NOTES D'UTILISATION GENERALES :
    - précisions de base :
        le code est en libre service. vous pouvez
        y modifier le HTML et le CSS qui se trouve
        sur ce fichier mais merci de ne pas enlever
        les crédits. n'hésitez pas à me contacter
        en cas de problème dans les mps de mon tumblr
        https://poesiescendrees.tumblr.com/

        la fonctionnalité de filtrage est réalisée par
        https://magnusthemes.tumblr.com/post/171696773190/isotope-combination-filtering

        le code est commenté au maximum dans
        la version commentée (en toute logique),
        afin que vous puissiez vous y retrouver
        le plus facilement possible, avec une
        connaissance minimale en CSS & HTML.
        la plupart des commentaires importants
        est reprise ici; ceux spécifiques au CSS
        et applicables aux variables à modifier
        ne sont pas disponibles sur ce document.

        petite note : tous les liens ont l'attribut
        <a href="#top">...</a>, il faut remplacer #top
        par votre lien (comme ça s'il n'est pas rempli,
        il renvoie simplement au haut de votre fenêtre).

        le fichier ici risque d'être potentiellement
        trop lourd pour tumblr à un certain moment,
        c'est déjà arrivé avec un code de longueur
        similaire sur un de mes anciens forums.
        je vous suggère de compacter un maximum
        de choses (à commencer par supprimer
        tous les commentaires que j'ai laissés
        dans le code mdr, ils prennent pas mal de
        place déjà), dans le CSS comme dans le HTML.
        ce site peut amplement faire l'affaire pour compresser :
        https://www.textfixerfr.com/html/compresser-du-code-html.php
        (vous n'êtes pas obligé d'y passer l'entièreté
        du code, sous peu que cela devienne rapidement illisible;
        vous pouvez vous borner à réduire seulement
        certaines parties).

        de plus je vous conseille de sauvegarder
        le fichier autre part (sur l'ordi d'un.e des admins
        ou quelque chose comme ça par exemple) à chaque
        modification, on n'est jamais à l'abris d'un bug
        avec des codes de cette taille <3





NOTES POUR LE CSS :
    - hébergement externe partiel du CSS :
        une partie du CSS est hébergée ailleurs,
        afin d'une part de préserver la place et
        la lisibiltié au sein du code. les valeurs
        modifiables par vous (couleurs + grandeurs
        + polices + styles des éléments du faceclaim)
        sont laissées ci-dessous.



    - variables :
        ces dernières permettent de modifier les couleurs
        et les grandeurs dans le code, leur utilisation est
        indispensable ! je vous renvoie à des ressources
        en ligne pour comprendre le concept :
        https://developer.mozilla.org/fr/docs/Web/CSS/Using_CSS_custom_properties
        (lire jusqu'à la rubrique "Utilisation Simple"
        comprise suffit amplement, puisque vous n'avez
        qu'à modifier le contenu des variables prédéfinies).
        ATTENTION à n'inclure ni espaces ni accentuation.



    - fonction "calc()" :
        la fonction permet de faire des calculs et si vous voulez
        y toucher n'hésitez pas à aller checker son fonctionnement
        https://developer.mozilla.org/fr/docs/Web/CSS/calc()
        encore une fois, les quelques premières lignes de la page
        suffisent, l'utilisation de calc est explicite.
        à noter que les résultats de calc peuvent être attribués
        à des propriétés directes tout comme à des variables,
        et peut également prendre des variables comme argument :

            width: calc(100% - 30% + 5%) --- > donne 75%
            height : calc(100vh - 30px) --- > donne 100% de la
                                              hauteur de la fenêtre
                                              - 30px
            margin-top : calc(var(--width) * 2 * var(--petit)
                                        --- > domme variable --width
                                              fois 2 variables --petit
            etc.





IMPORTANT : UTILISATION DES FILTRES
    - définition des filtres applicables :
        cf début du <body> dans le html.

        chaque groupe de filtres (genre, origines,...)
        doit avoir un nom de groupe différent !!!
        ( <u... data-filter-group="nom_technique_groupe"> )
        indiquez la classe "exclusive" pour <ul>
        si vous voulez que les filtres soient exclusifs
        (comme pour le filtre par défaut "gender"
        dont on ne peut sélectionner qu'un filtre
        à la fois, alors que les autres sont cumulables).

        après, vous définissez les filtres
        disponibles pour le groupe en définissant son .nom
        (sans espace ni accent et avec le point devant !!)
        dans son attribut data-filter-value :
        <li><a href="#" data-filter-value=".nom-filtre">...

        plus loin dans le code,
        les éléments portant ces filtres auront
        des classes correspondant au .nom des filtres
        (mais sans le point devant), cumulables.
        par exemple un monsieur john doe d'origines
        françaises et japonaises aura les classes :
        <div class="element_section m white asian">

        parce que john doe, pour le groupe "genders",
        correspond au filtre .m de ceux définis
        (.f, .m, et .nb : non cumulables car
        groupe exclusif)

        et quepour le groupe "origins" il correspond
        à .white et .asian (cumulables car non
        exclusifs)

        (element_section étant une classe commune
        à tous les blocs d'éléments, à ne surtout
        pas modifier ! mais vous pouvez rajouter
        d'autres classes si voulu).

        vous n'êtes pas obligé.e de préciser
        pour chaque élément à quel filtre il
        appartient (par exemple vous pouvez
        ne rien indiquer sur le statut, si indéfini)
        il apparaîtra avec le filtre "tout" sélectionné.

        observez les exemples si ce n'est pas clair,
        vous vous y retrouverez sûrement mieux.
        je vous renvoie au billet du.de la créateurice
        de la fonction de filtrage sinon :
        https://magnusthemes.tumblr.com/post/171696773190/isotope-combination-filtering



    - faire correspondre les éléments aux filtres :
        dans la partie principale avec tous les éléments
        les div de class .element_section ont d'autres
        classes qui correspondent aux filtres,
        comme expliqué ci-dessus. ne modifiez pas
        ce div mais vous pouvez faire ce que vous voulez
        de ce qu'il y a dedans, ajouter des champs,
        en modifier ou changer complètement.
        vous pouvez supprimer le <scroll...</scroll>,
        l'image, le nom, tout en fait,
        ça fonctionnera parfaitement aussi.





CODE POUR RAJOUTER UN ELEMENT :

<!----- DEBUT ELEMENT ----->
    <!--modifier les différents filtre1234 par les vrais noms
        de filtres comme définis au début du code -->
    <div class="element_section filtre1 filtre2 filtre3 filtre4">
        <div class="bp_element">

            <mg class="name_element">prénom nom</mg>
            <img src="URL_AVATAR" class="avatar_element"/>

            <scroll class="infos_element">
                description ici aussi longue que voulue.
                possible de supprimer tout le < scroll >.
                possible également d'en ajouter.
            </scroll>

            <!--possible de supprimer/ajouter des liens !-->
            <div class="links_element nomargin center-align">
                <a href="LIEN_PROFIL" class="button-alike table_js">☼</a>
                <a href="LIEN_ELEMENT" class="button-alike table_js">☏</a>
            </div>
        </div>
    </div>
<!----- END ELEMENT ----->
