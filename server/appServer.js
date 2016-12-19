/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
 
// Startup magpie server
// TODO
// to doc: full stack multiple domain 
// web application framework
define([
// magpie modules
'magpie/log!magpie/server/appServer', 'magpie/util/config', 'module',//
// requirejs modules
 'require', //
// node modules
 'express', 'serve-static', 'http', 'fs' ], //
function(
// magpie modules 
log, config, module, //
// requirejs modules
r, //
// node modules
express, serveStatic, http, fs) {
	/*jshint -W004 */ 
	var config = config(module, {
		homeFolder: r.toUrl('magpie/server/appServer').replace(/\/magpie\/server\/appServer$/, ''),
		port : 8080,
		//path : '/',
		baseUrl : '/',
		deploymentPath:['deployments'],
		serveStatic:['magpie','lib'],
		_deploymentPathRelativToHomeFolder:true,
		_serveStaticRelativToHomeFolder:true,
	});

	//config.
	
	//
	// Start up the web server
	//
	if (log.isDebug) {
		log.debug('start Web Server:', config);
	} else {
		log('start Web Server: port', config.port);
	}

	var app = express();
	var server = http.createServer(app);
	server.listen(config.port);

//	var homeFolder = r.toUrl('magpie/server/appServer').replace(/\/magpie\/server\/appServer$/, '');
//	var baseUrl = r.toUrl('.');
	log.debug('baseUrl:',config.homeFolder);


	var deployments = [];
	config.serveStatic.forEach(function(folder){
		var deployment = {
//				"static":{
				type: "static",
				deployment: folder,
				url : config.baseUrl+ folder,//
				deployDirectory : config._serveStaticRelativToHomeFolder? config.homeFolder+ folder:folder,//
				packageName : '',//
				hasServerExtensionBundle : false,//
				hasWebBundle : false,
				isStatic: true
//				}
			};
		deployments.push(deployment);
		if (log.isDebug) {
			log.debug('serveStatic: \''+ folder+'\'','as deployment:',deployment);
		} else {
			log('serveStatic: \''+ folder+'\'');
		}
		app.use(deployment.url, serveStatic(deployment.deployDirectory));	
	});
	
	//
	// load domain
	//

	
	function addDeployment(deploymentCandidateRootFolder, path) {
		log('addDeployment:', deploymentCandidateRootFolder);
		//
		// load server extensions for domain
		//
		var deployment = {
			deployment : deploymentCandidateRootFolder,//
			deployDirectory : deploymentCandidateRootFolder,//
			//deployDirectoryPath: path
			url : '/' + deploymentCandidateRootFolder,//
			packageName : deploymentCandidateRootFolder,//
			hasServerExtensionBundle : false,//
			hasWebBundle : false,
			isStatic: false
		};
		log.debug('addDeployment:', deployment);
		deployments.push(deployment);

		function startServlet() {
			fs.stat(path + '/server/config.js', function(err, stats) {
				var configExists = stats && stats.isFile();

				//
				// map stack
				//
				
				// define virtual package for deployment that holes the deployment details 
				var virtualPackageForDeployment = deployment.packageName + '/deployment'; 
				define(virtualPackageForDeployment, deployment);
				var map = {};
				map[deployment.packageName] = {
						//TODO doc domain  // to use for extending server e.g.: with websocket 
						// FIXME rename it???
					'domain' : virtualPackageForDeployment
				};
				require.config({
					map : map
				});

				fs.stat(path + '/server/main.js', function(err, stats) {
					if (stats && stats.isFile()) {
						var router = express.Router();
						app.use(deployment.url,router);
						
						//TODO rename to use? or rethink calback paramteres
						// OR remove this ability?
						deployment.extend=function(callback){
							callback(router,server);
						};
						
						deployment.hasServerExtensionBundle = true;
						log('load server extension for deployment:',
								deployment.deployDirectory);
						require.config({
							packages : [ //
							{
								name : deployment.packageName,
								main : 'main',
								location :  path + '/server'
							} //
							],
							deps : [ configExists ? //
							// FIXME review
							 path + '/server/config' : deployment.packageName ],
							callback : function() {
								if (configExists) {
									require([ deployment.packageName ]);
								}
							}
						});
					}
					fs.stat(path + '/web', function(err, stats) {
						if (stats && stats.isDirectory()) {
							deployment.hasWebBundle = true;
							log('start static server for deployment:',
									deployment.deployDirectory);
							app.use(deployment.url, serveStatic(path + '/web'));
						}
					});

				});

			});
		}

		fs.stat(path + '/deploy.js', function(err, stats) {
			var deployConfigExists = stats && stats.isFile();
			if (deployConfigExists) {
				require([ path + '/deploy' ],
						function(deploy) {
							log('deploy:', deploy);
							for (var p in deploy) {
								deployment[p] = deploy[p];
							}
							startServlet(deployment);
						});
			} else {
				startServlet(deployment);
			}
		});

	}

	// REST server console
	app.get('/_deployments', function(req, resp, next) {
		resp.send(deployments);
		next();
	});

	config.deploymentPath.forEach(function(deploymentPathFolder){
		var deploymentPath = config._deploymentPathRelativToHomeFolder?config.homeFolder + deploymentPathFolder: deploymentPathFolder;
		if (log.isDebug) {
			log.debug('process deployment folder:',deploymentPathFolder,'path:',deploymentPath);
		} else {
			log('process deployment folder:',deploymentPathFolder);
		}
		
		fs.readdir(deploymentPathFolder, function(err, deploymentCandidateFiles) {
			deploymentCandidateFiles.forEach(function(deploymentCandidateFile) {
				var path = deploymentPathFolder + '/' + deploymentCandidateFile;
				fs.stat(path, function(err, stats) {
					if (stats && stats.isDirectory()) {
						addDeployment(deploymentCandidateFile, path);
					}
				});
			});
		});
		
	});

	return {
		config : config,
		httpServer : server,
		app : app
	};

});
