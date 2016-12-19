define([ 'magpie/log!app/list', 'knockout'], //
function(log, ko) {
	return {
		
		attachedCallback : function() {
			var viewModel=  {
					domains:ko.observableArray()
			};
						
			ko.applyBindings(viewModel, this)


			require(['text!/_deployments?date='+new Date()],function(sDomains){
				var domains = JSON.parse(sDomains)
				log('rest data:',domains)
				for (d in domains){
					viewModel.domains.push(domains[d])
				}
				
			})


		}

	}
});
