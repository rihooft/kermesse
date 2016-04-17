### Node.js

Launch server
```
node server.js
NODE_CONFIG=/<path>/config/dev-mbl.json node server.js
```
Url
```
http://localhost:8003
```

### MQTT

* Le format des messages échangés entre mosquitto et le serveur node.js est simple (ex: "2")
* Tester l'envoi d'un event (via HTTP) `curl -X POST http://localhost:8003/message -d "message=2"`. Le server envoi au serveur mosquitto le message "2", cela correspond au numéro du joueur. Ici, 1 point va être ajouté au joueur 2
* Le fichier MQTTBroker est branché sur le server/topic indiqué dans la configuration

### Notes

* Ajout de personnages: ajouter des images dans le dossier "static/images/characters"
* Configuration: fichier "config/local.json"

### Todo

* Mettre refresh interval & total points dans configuration
* Find arena images
