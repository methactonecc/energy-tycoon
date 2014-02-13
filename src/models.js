/**
 * Contains all the models (data stores) we need.
 */
$(function(){
	var Career = Backbone.Model.extend({
		/**
		 * Information about you, the player.
		 * 
		 * Fields:
		 * 	int money
		 * 	int year	the current round (known as a year.) Starts at 1.
		 * 	String name
		 */	
		 
		 defaults: {
			 money:	100000,
			 year:	1,
			 name:	"Neel"
		 },
		 
		 /* Functions */
		
		/**
		 * Changes the amount of money you have (whether positive or negative.)
		 */
		changeMoney: function(amount){
			this.set('money',this.get('money') + amount);
		},
		
		/**
		 * Increments the year.
		 */
		nextYear: function(){
			this.set('year',this.get('year')+1);
		}
	});
	
	var Map = Backbone.Model.extend({
		/*
		 * Houses information about the map's current state.
		 * 
		 * Fields:
		 * 	Region region	(active region)
		 * 	City city		(active city)
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
	window.map = new Map();
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
