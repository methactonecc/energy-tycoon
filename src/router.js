$(function(){
	ET.WorldRouter = Backbone.Router.extend({
		/**
		 * Routes your movement around the game world: seeing different parts of the country, your stats, etc.
		 */
		routes: {
			"pane/map": 				"routeMain",
			"pane/map/region/:region": 	"routeRegion",
			"pane/map/city/:city": 		"routeCity",
			
			"pane/:name": 				"routePane"
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
			ET.map.set('region', ET.Regions.Nation);
			ET.map.set('viewType', ET.ViewTypes.Nation);
			//appView.render();
		},
		
		routeRegion: function(regionSlug){
			var region = ET.Regions.findWhere({slug: regionSlug});
			ET.map.set('region',region);
			ET.map.set('viewType', ET.ViewTypes.Region);	
			
			this.routePane("map");		
		},
		
		routeCity: function(cityName){
			var city = ET.cities.findWhere({name: cityName});
			ET.map.set('city',city);
			ET.map.set('viewType', ET.ViewTypes.City);			
			
			this.routePane("map");
		},		
		
		routePane: function(paneName){
			//activate that tab
			$('#tab-' + paneName).tab('show');
		}
		
	});
});
	