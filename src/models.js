/**
 * Contains all the models (data stores) we need.
 */
$(function(){
	var Career = Backbone.Model.extend({
		/**
		 * Information about you, the player. Only create one of these.
		 * 
		 * Fields:
		 * 	int money
		 */	
		 
		 
	});
	
	var City = Backbone.Model.extend({
		/*
		 * Data for an individual city, where you can build plants.
		 * Fields:
		 *  String name
		 * 	bool owned (by player)
		 *	Region region (see Regions enum)
		 * 	int[] nationalCoords		coordinates of city on the national map in form [x,y] where x and y are in percents from top left (in decimal form)
		 * int[] regionalCoords			coordinates for the region they're in. Same format as national.
		 */
	});
	
	var Cities = Backbone.Collection.extend({
		/*
		 * List of cities.
		 */
		
		model: City
	});
	window.cities = new Cities([
		new City({ name: "New York", 		nationalCoords: [.91,.30], regionalCoords: [.38,.64]}),	
		new City({ name: "Philadelphia", 	nationalCoords: [.89,.35], regionalCoords: [.32,.74]}),
		new City({ name: "Boston", 			nationalCoords: [.95,.23], regionalCoords: [.49,.47]}),
		new City({ name: "Washington, DC", 	nationalCoords: [.86,.41], regionalCoords: [.25,.85]})
	]);		
});
