$(document).ready(function(){
	
	var WorldRouter = Backbone.Router.extend({
		/**
		 * Routes your movement around the game world: seeing different parts of the country, your stats, etc.
		 */
		routes: {
			"main": 			"routeMain",
			"region/:region": 	"routeRegion"
		},
		
		/*
		 * 
		 * Handling routing.
		 * 
		 */
		
		/*
		 * Loads main view (the whole country).
		 */
		routeMain: function(){
			console.log('go');
		}
		
	});
	var worldRouter = new WorldRouter();
	Backbone.history.start({ 
		//pushState: 	true,
	});
	worldRouter.navigate("main", { trigger: true });
	
}); 
