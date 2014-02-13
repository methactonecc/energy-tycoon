/**
 * Contains all the models (data stores) we need.
 */
$(function(){
	var Career = Backbone.Model.extend({
		/**
		 * Information about you, the player, and the current game state.
		 * 
		 * Fields:
		 * 	int money
		 * 	Region region 	the active region.
		 */	
		 
		 
	});
	
	var City = Backbone.Model.extend({
		/*
		 * Data for an individual city, where you can build plants.
		 * Fields:
		 *  String name
		 * 	bool owned (by player)
		 *  bool headquarters
		 *	Region region (see Regions enum)
		 * 	int[] nationalCoords		coordinates of city on the national map in form [x,y] where x and y are in percents from top left (in decimal form)
		 * int[] regionalCoords			coordinates for the region they're in. Same format as national.
		 * 
		 * In constructor, pass:
		 * 	String name
		 * 	String regionName ("Northeast", "West", etc.)
		 * 	int[] nationalCoords
		 * 	int[] regionalCoords
		 */
		
		constructor: function(){
			Backbone.Model.prototype.constructor.apply(this, arguments);
			
			if(this.get('regionName')){
				this.set('region', Regions[this.get('regionName')]);
			}
		}
	});
	
	var Cities = Backbone.Collection.extend({
		/*
		 * List of cities.
		 */
		
		model: City,
		
		url: 'res/stats/cities.json'
	});
	
	
	//instantiating models
	window.career = new Career();
	
	window.cities = new Cities();
	cities.fetch({
		success: function(model, response, options){
			cities.reset(response);
			
			cities.url = null; //prevent accidentally saving to server later
			
			//TEMP
			cities.each(function(c){
				if(c.get('region') === Regions.Northeast){
					c.set('owned',true);
				}
			});
			cities.findWhere({"name": "New York"}).set('headquarters',true);
			
			
			
			appView.render(); 
		},
		error: function(model, response, options){
		}
	});
});
