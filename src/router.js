$(function(){
	var WorldRouter = Backbone.Router.extend({
		/**
		 * Routes your movement around the game world: seeing different parts of the country, your stats, etc.
		 */
		routes: {
			"pane/map": 				"routeMain",
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
			console.log(5);
			$('#tab-map').tab('show');
			ET.map.set('region', ET.Regions.Nation);
			ET.map.set('viewType', ET.ViewTypes.Nation);
			//appView.render();
		},
		
		routeRegion: function(regionSlug){
			var region = ET.Regions.findWhere({slug: regionSlug});
			ET.map.set('region',region);
			ET.map.set('viewType', ET.ViewTypes.Region);			
		},
		
		routeCity: function(cityName){
			var city = ET.cities.findWhere({name: cityName});
			ET.map.set('city',city);
			ET.map.set('viewType', ET.ViewTypes.City);			
		},		
		
		routePane: function(paneName){
			console.log(7);
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
	ET.worldRouter.navigate("pane/map", { trigger: true });
});
	