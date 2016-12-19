require.config({

	paths : {

		text :		'lib/require/text',
		less : 		'magpie/dom/less',

		magpie: '/magpie',

		knockout: '/lib/knockout/knockout-3.4.0'
	},


	deps : [ 'magpie/config'],

	callback: function(){
		require([
		         'magpie/html5/customElement!app/s-list',//
		         'less!app/less'
	         ])
	},

	waitSeconds : 5

});
