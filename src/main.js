$(function(){
	//Underscore custom mixins!
	_.mixin({
		/**
		 * Makes String interpretation a lot easier.
		 * Usage: _.format("Hi, <%=name%>", {name: "Lorax"}) -> "Hi, Lorax" 
		 * @param {String} string	Contains variables mixed with normal text, with variables wrapped in: <%= ... %>
		 * @param {Object} object	Contains name-value pairs. The name matches with the variable named in string, and the value is what it's replaced with.
		 * @return	{String}	An interpolated string.
		 */
		  format: function(string, object) {
		    return (_.template(string))(object);
		  }
	});	
	
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
			map.set('viewType', ViewTypes.Nation);
			//appView.render();
		},
		
		routeRegion: function(regionSlug){
			var region = Regions.findWhere({slug: regionSlug});
			map.set('region',region);
			map.set('viewType', ViewTypes.Region);			
		},
		
		routeCity: function(cityName){
			var city = cities.findWhere({name: cityName});
			map.set('city',city);
			map.set('viewType', ViewTypes.City);			
		},		
		
	});
	
	//init view
	window.appView = new AppView({ model: map });	
	window.careerView = new CareerView({ model: career });
	careerView.render();
	window.timerControlView = new TimerControlView({ model: timer });
	timerControlView.render();
	//appView.render();
	
	window.worldRouter = new WorldRouter();
	Backbone.history.start({ 
		//pushState: 	true,
	});
	worldRouter.navigate("main", { trigger: true });
	
	

}); 
