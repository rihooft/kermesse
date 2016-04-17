var glob = require('glob'), path = require('path'), MQTTBroker = require(path.join(BASE_DIR, "app/MQTTBroker.js")),
	GameModel = require(path.join(BASE_DIR, "app/GameModel.js")), configuration = require(CONFIG_FILE);

/**
 * Initialize
 */
exports.initialize = function (server) {
	// Base
	server.get('/', function (req, res, next) {
		return res.render("index");
	});

	// Views
	server.get('/views/arena', function (req, res, next) {
		return res.render("arena");
	});

	server.get('/views/new-game', function (req, res, next) {
		return res.render("new-game");
	});

	// Create game
	server.post('/games', function (req, res, next) {
		GameModel.createGame(req.body.players, function () {
			return res.json(GameModel.getCurrentGame());
		});
	});

	// Notify winners
	server.post('/games/winners', function (req, res, next) {
	    console.log(new Date().toISOString(),"- POST player wins...");
        if ("undefined" !== typeof(req.body.winners)) {
            return MQTTBroker.publish(configuration.mqtt.topic.win + "/" + req.body.winners, "", function () {
                return res.json({"success": true});
            });
            return MQTTBroker.flushTopics();
        }
        return res.status(400).json({"error": "Missing 'winners' parameter"});
    });

	// Notify players that game starts and sends the totalPoints to complete
	server.post('/games/start', function (req, res, next) {
		console.log(new Date().toISOString(),"- POST game starts with", req.body.nbPlayers,"players for", req.body.totalPoints,"points ...");
        if ("undefined" !== typeof(req.body.nbPlayers)) {
	        return MQTTBroker.publish(configuration.mqtt.topic.start, req.body.nbPlayers, function () {
	            return res.json({"success": true});
	        });
	    }
        if ("undefined" !== typeof(req.body.totalPoints)) {
	        return MQTTBroker.publish(configuration.mqtt.topic.totalPoints, req.body.totalPoints, function () {
	            return res.json({"success": true});
	        });
        }

        return res.status(400).json({"error": "Missing 'start' parameter"});
    });

	// Get current game
	server.get('/games/latest', function (req, res, next) {
		return res.json(GameModel.getCurrentGame());
	});

	// Characters
	server.get('/characters', function (req, res, next) {
		glob(path.join(BASE_DIR, 'static/images/characters/menu/*.png'), function (err, files) {
			return res.json(files.map(function (file) {
				return {
					"name": path.basename(file).split(".")[0],
					"action": path.basename(file).split(".")[1],
					"image": path.join("images/characters/menu", path.basename(file))
				}
			}));
		});
	});

	// MQTT
	server.post('/message', function (req, res, next) {
		if ("undefined" !== typeof(req.body.message)) {
			return MQTTBroker.publish(configuration.mqtt.topic.message, req.body.message, function () {
				return res.json({"success": true});
			});
		}

		return res.status(400).json({"error": "Missing 'message' parameter"});
	});
};
