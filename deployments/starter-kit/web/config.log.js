require.config({
	config : {
		'magpie/log/main' : {
			root : {
				level : 'info'
			},

			'magpie/html5/customElement' : {
				level : 'error'
			},
			'app/main':{
				level:'debug'
			}

		}
	}
});