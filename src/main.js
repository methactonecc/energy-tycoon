$(document).ready(function(){
	
	//World properties (window)
	window.region = Regions.Nation; //by default
	//see models for window.cities
	
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
			region = Regions.Nation;
		}
		
	});
	var worldRouter = new WorldRouter();
	Backbone.history.start({ 
		//pushState: 	true,
	});

	
	
	//making objects
	window.appView = new AppView();


	worldRouter.navigate("main", { trigger: true });
}); 
