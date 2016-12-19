//Bootstrapping magpie appServer in nodeJS.
// (it requires requireJS AMD loader)
// Start it with next command line:
//node server.node.js
//or with nodemon:
//nodemon node server.node.js
var requirejs = require('requirejs');
requirejs.config({
	// Pass the top-level main.js/index.js require
	// function to requirejs so that node modules
	// are loaded relative to the top-level JS file.
	nodeRequire : require,

	paths : {
		magpie: 'magpie' //
	},

	deps : [ //
 		'magpie/config', //
	    'server.config.log', //
	    'server.config', //
		'magpie/server/appServer'
	]
});