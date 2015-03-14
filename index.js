/**
 * Dependencies.
 */
var Hapi = require("hapi");
var config = require("./config");
var routes = require("./route");
var server = new Hapi.Server(config.host, Number(config.port), config.hapi.serverOptions);

// Register bell with the server
server.pack.register(require('bell'), function (err) {
	if (err) throw err;

    for(var providerName in config.login)
    {	    	
		// Declare an authentication strategy using the bell scheme
		// with the name of the provider, cookie encryption password,
		// and the OAuth client credentials.
		server.auth.strategy(providerName, 'bell', {
	        provider: providerName,
	        password: config.cookie.password,
	        clientId: config.login[providerName].clientId,
	        clientSecret: config.login[providerName].clientSecret,
	        isSecure: false     // Terrible idea but required if not using HTTPS
	    });
    }
    // Add configured routes to the server routes
	routes.forEach(function(entry) {
		server.route(entry);
	});

    // Start server
	server.start(function() {
		console.log("Hapi server started @", server.info.uri);
	});
});