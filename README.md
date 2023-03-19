# Hackaviz 2023 : Le prix de l’énergie pour les véhicules particuliers

----

#### Réalisation par Alexis

----

Retrouvez mon travail : [ICI](https://alexis06030631.github.io/hackaviz2023/)

## Comment j'en suis arrivé là ?

J'ai entendu parler de ce concours par le bouche-à-oreille. J'ai donc décidé de m'y inscrire et de participer à ce concours.
Au départ, j'étais un peu perdu sur le sujet. Je ne savais pas trop quoi faire. J'ai ainsi commencé à chercher des méthodes pour représenter les données.


### Étapes :

Après avoir découvert les données et avoir remarqué que les données étaient très nombreuses :
- La première chose que j'ai faite, c'est de créer une base de données avec les données que j'avais récupérées afin de pouvoir les manipuler plus facilement et de pouvoir les utiliser pour créer des cartes.

- En cherchant des méthodes pour représenter les données, j'ai trouvé une bibliothèque python qui s'appelle [folium](https://python-visualization.github.io/folium/). Cette bibliothèque permet de représenter des données sur une carte.
- Ensuite j'ai commencé à créer mes premières cartes avec les liaisons que je faisais entre les données des différentes tables de la base de données.
- Cependant, je me suis très vite confronté à un problème, le nombre de données était trop important pour tenir sur une seule carte et que celle-ci reste lisible. Deux choix s'offraient à moi : soit je faisais une vidéo qui représenterait les données, soit je faisais une carte interactive. J'ai donc décidé de faire une carte interactive.
- En me renseignant sur les cartes interactives, je suis tombé sur une bibliothèque javascript [leaflet](https://leafletjs.com/). Ce qui m'avantageait avec cette bibliothèque, c'est qu'il s'agissait d'une bibliothèque javascript et que j'avais déjà de bonnes connaissances en javascript. J'ai donc décidé de faire une carte interactive avec cette bibliothèque.
- J'ai ensuite créé mes propres fonctions pour pouvoir intégrer les données dans la carte. En passant par des fonctions qui me généraient des fichiers GeoJson à partir des données de la base de données. À des fonctions qui me permettaient de créer des marqueurs sur la carte et d'adapter la carte en fonction des données.



### Finalité :

- J'ai rendu mon travail en ayant appris de nouvelles choses et en ayant pu mettre en pratique des connaissances que j'avais déjà acquises pour un projet autre que personnel.
- J'ai rendu un travail qui ne me semble pas trop mal, bien que le manque de temps m'ait empêché de faire certaines choses que j'aurais voulu faire.
- Merci à [TDV](https://toulouse-dataviz.fr/) pour ce concours.

----

#### Auteur : Alexis ([GitHub](https://github.com/Alexis06030631), [Instagram](https://www.instagram.com/leko_system/))
