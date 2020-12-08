# CoursJSServer

Jouons avec javascript coté serveur.

## Cleverapp_1
Une application en Javascript à deployer sur Clever Cloud permettant de mfaire un mini chat.   
L'ensemble des utilisateurs et messages sont stockés dans le JS.

## Cleverapp_2
On rajoute un mongoDB, gratuit sur CleverCloud, pour stoker nos éléments.

Faire tourner un mongo en local   
````
docker run -d -p 27017-27019:27017-27019 --name mongodb mongo:4.0.4
docker exec -it mongodb bash
mongo
show dbs
use [YOUR DB]

````
