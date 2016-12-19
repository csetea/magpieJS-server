requirejs.config({
	config : {
		'magpie/server/appServer' : {
			homeFolder : requirejs.toUrl('.'),
			port : 8081,
			deploymentPath : [ 'deployments',
			                   '../acs-magpie-server-deployments/dev-test/',
			                   '../acs-magpie-server-deployments/magpie-dev/',
			                   '../acs-magpie-server-deployments/private/',
			                   '../acs-magpie-server-deployments/TELES/'
			                   ],
			serveStatic : [
			// distribute magpie
			'magpie',
			// distribute common libraries
			'lib',
			'dist'
		 	]
		}
	}
});
