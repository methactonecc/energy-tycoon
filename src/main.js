$(function(){
	
	var WorldRouter = Backbone.Router.extend({
		/**
		 * Routes your movement around the game world: seeing different parts of the country, your stats, etc.
		 */
		routes: {
			"main": 			"routeMain",
			"region/:region": 	"routeRegion",
			"city/:city": 		"routeCity",
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
			map.set('region', Regions.Nation);
			
			//appView.render();
		},
		
		routeRegion: function(regionSlug){
			var region = Regions.findWhere({slug: regionSlug});
			map.set('region',region);
		},
		
		routeCity: function(cityName){
			var city = cities.findWhere({name: cityName});
			map.set('city',city);
		},		
		
	});
	
	//init view
	window.appView = new AppView({ model: map });	
	window.careerView = new CareerView({ model: career });
	careerView.render();
	//appView.render();
	
	window.worldRouter = new WorldRouter();
	Backbone.history.start({ 
		//pushState: 	true,
	});
	worldRouter.navigate("main", { trigger: true });
	
	
	career.researchPlantType(Plants.Solar);
}); 
