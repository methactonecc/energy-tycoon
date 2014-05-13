$(function(){
	window.ET = {}; //new app namespace instead of window
		
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
	ET.appView = new ET.AppView({ model: ET.map });	
	ET.careerView = new ET.CareerView({ model: ET.career });
	ET.careerView.render();
	ET.sidebarView = new ET.SidebarView({ model: ET.career });
	ET.sidebarView.render();
	ET.timerControlView = new ET.TimerControlView({ model: ET.timer });
	ET.timerControlView.render();
	//appView.render();
	
	ET.worldRouter = new WorldRouter();
	Backbone.history.start({ 
		//pushState: 	true,
	});
	ET.worldRouter.navigate("main", { trigger: true });
}); 
