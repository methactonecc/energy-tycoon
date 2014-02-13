$(function(){
	
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
			career.set('region', Regions.Nation);
			//appView.render();
		},
		
		routeRegion: function(regionSlug){
			var region = Regions.findWhere({slug: regionSlug});
			career.set('region',region);
		}
		
	});
	
	//init view
	window.appView = new AppView({ model: career });	
	//appView.render();
	
	window.worldRouter = new WorldRouter();
	Backbone.history.start({ 
		//pushState: 	true,
	});
	worldRouter.navigate("main", { trigger: true });
}); 
