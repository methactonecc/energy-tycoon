$(function(){
	/*
	 * Contains enums and other constants.
	 */
	
	//****************** Regions
	var Region = Backbone.Model.extend({}); //String name
	window.Regions = new Backbone.Collection([
			{ name: "Nation",		slug: "usa" }, //entire country
			{ name: "Northeast",	slug: "northeast" },
			{ name: "South",		slug: "south" },
			{ name: "Midwest",		slug: "midwest" },
			{ name: "West",			slug: "west" },
		], {
			model: Region
		});
	//Expose members through public fields; eg Regions.Northeast.
	Regions.each(function(item){
		Regions[item.get("name")] = item;
	});
	
	//****************** Plants
	/*
	 * These are mutable items for power plants. Grab a copy whenever you use one.
	 */
	window.Plants = new Backbone.Collection([
			{ name: "Solar",	powerName: "Solar Power",		plantName: "Solar Farm",	
			researchCost: 20000,	constructionCost: 25000, income: 2000,	powerProduction: 50 },
		], {
			model: Plant
		});
	//Expose members through public fields
	Plants.each(function(item){
		Plants[item.get("name")] = item;
	});			
});
