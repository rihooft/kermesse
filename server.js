var express = require('express'),
	server = express(), path = require('path'),
	http = require('http'), dust = require('dustjs-linkedin'),
    consolidate = require('consolidate'), bodyParser = require('body-parser');

global.BASE_DIR = __dirname;
global.CONFIG_FILE = process.env.NODE_CONFIG || path.join(BASE_DIR, "config/local.json");

var configuration = require(CONFIG_FILE),
	Router = require(path.join(BASE_DIR, "app/Router.js")),
	MQTTBroker = require(path.join(BASE_DIR, "app/MQTTBroker.js"));

/**
 * Configuration
 */
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({"extended": true}));
server.use(express.static(path.join(BASE_DIR, 'static')));

server.engine('dust', consolidate.dust);
server.set('template_engine', "dust");
server.set('view engine', "dust");
server.set('views', BASE_DIR + '/views');

/**
 * Initialize
 */
Router.initialize(server);
MQTTBroker.initialize();

/**
 * HTTP server
 */
http.createServer(server).listen(configuration.server.port, function () {
    console.log("HTTP server listening on port " + configuration.server.port);
});
