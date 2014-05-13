$(function(){
	var WorldRouter = Backbone.Router.extend({
		/**
		 * Routes your movement around the game world: seeing different parts of the country, your stats, etc.
		 */
		routes: {
			"pane/map/main": 			"routeMain",
			"pane/map/region/:region": 	"routeRegion",
			"pane/map/city/:city": 		"routeCity",
			
			"pane/:name": 		"routePane"
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
			$('#tab-map').tab('show');
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
		
		routePane: function(paneName){
			//activate that tab
			$('#tab-' + paneName).tab('show');
		}
		
	});
	
	//init view
	ET.mapView = new ET.MapView({ model: ET.map });	
	ET.careerView = new ET.CareerView({ model: ET.career });
	ET.careerView.render();
	ET.sidebarView = new ET.SidebarView({ model: ET.career });
	ET.sidebarView.render();
	ET.timerControlView = new ET.TimerControlView({ model: ET.timer });
	ET.timerControlView.render();
	//appView.render();
	
	ET.worldRouter = new WorldRouter();
	Backbone.history.start({
	//pushState: true,
	});
	ET.worldRouter.navigate("panel/map/main", { trigger: true });
});
	