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
		 * 	bool owned (by player)
		 *	Region region (see Regions enum)
		 * 	int[] nationalCoords		[x,y] coordinates of city on the national map
		 */
	});
	
	var Cities = Backbone.Collection.extend({
		/*
		 * List of cities.
		 */
		
		model: City
	});
});
