var mqtt = require('mqtt'), path = require('path'), configuration = require(CONFIG_FILE),
	_client = null, GameModel = require(path.join(BASE_DIR, "app/GameModel.js"));

/**
 * Initialize
 */
exports.initialize = function () {
	_client  = mqtt.connect(configuration.mqtt.url, {
	    "port": configuration.mqtt.port/*,
        "username": configuration.mqtt.user,
        "password": configuration.mqtt.password*/
    });

	// flushes the topics to avoid unexpected message when a new game starts
	this.flushTopics();

	_client.on('connect', function() { // When connected
		  // subscribe to a topic
	    _client.subscribe(configuration.mqtt.topic.sensor);
	    _client.subscribe(configuration.mqtt.topic.getConfig);
	    _client.subscribe(configuration.mqtt.topic.message);

	    console.log('Connection to MQTT done. All subscribes are done');
	 });

	// On message event
	this._onMessageEvent();
};

/**
 * Publish
 */
exports.publish = function (topic, message, callback) {
    console.log(new Date().toISOString(), "- Publish -> ", topic, "/", message);
//    console.log(_client);
//	return _client.publish(topic, message.toString(), "{qos:0, retain:true}");
return _client.publish(topic, message.toString(), callback);
	return _client.publish(topic, message.toString(), {qos:configuration.mqtt.topic.qos, retain:configuration.mqtt.topic.retain}, callback);
};

/**
 * On message event
 */
exports._onMessageEvent = function () {
	var _playerIndex = null, _defaultPoints = 1;

	// On "message" event
	_client.on('message', function (topic, message) {
		console.log(new Date().toISOString(),"- _onMessageEvent", topic, "/", message.toString());
		if (configuration.mqtt.topic.sensor==topic) {
			_playerIndex = parseInt(message.toString(), 10);
			// Update player points
			GameModel.incrementPlayerPoints(_playerIndex, _defaultPoints);
		} else if (configuration.mqtt.topic.getConfig==topic) {
//			_client.publish(configuration.mqtt.topic.setConfig, "32|128", "{qos:0}");
			return _client.publish(configuration.mqtt.topic.setConfig, "128|255", {qos:configuration.mqtt.topic.qos, retain:configuration.mqtt.topic.retain});
		} else if (configuration.mqtt.topic.message==topic) {
            _playerIndex = parseInt(message.toString(), 10);
            // Update player points
            GameModel.incrementPlayerPoints(_playerIndex, _defaultPoints);
		}
	});
};

/**
 * Flushes all the topics set in the configuration object
 */
exports.flushTopics = function(){
	console.log(new Date().toISOString(),"- flushing topics...");
	for(var _topic in configuration.mqtt.topic) {
//		console.log("flush ", configuration.mqtt.topic[_topic]);
//		_client.publish(configuration.mqtt.topic[_topic], "", "{qos:2, retain:true}");
		_client.publish(configuration.mqtt.topic[_topic], "", {qos:configuration.mqtt.topic.qos, retain:true});
	}
}
