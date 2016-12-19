require.config({

	paths : {
		text: '/lib/require/text',
		less: 'magpie/dom/less',
		css :	'lib/require/require-css/css',
		
		magpie: '/magpie'
	},
	
	
	deps : [ 'config.log','magpie/config'],
	
	callback: require(['app/config']),

	waitSeconds : 15
	
	
});