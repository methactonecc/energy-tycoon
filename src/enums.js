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
	
	//****************** View types
	var ViewType = Backbone.Model.extend({});
	window.ViewTypes = new Backbone.Collection([
			{ name: "Nation" },
			{ name: "Region" },
			{ name: "City" }
		], {
			model: ViewType
		});
	//Expose members through public fields
	ViewTypes.each(function(item){
		ViewTypes[item.get("name")] = item;
	});	
	
	//****************** Plants
	/*
	 * These are mutable items for power plants. Grab a copy whenever you use one.
	 */
	var _Plants = Backbone.Collection.extend(/*[
			{ name: "Solar",	slug: "solar",		powerName: "Solar Power",		plantName: "Solar Farm",	suitabilityName: "Sunniness",
			researchCost: 20000,	constructionCost: 25000, income: 2000,	powerProduction: 50 },
			{ name: "Wind",		slug: "wind",		powerName: "Wind Power",		plantName: "Wind Farm", suitabilityName: "Windiness",
			researchCost: 20000,	constructionCost: 25000, income: 2000,	powerProduction: 100 },
			{ name: "FuelCell",	slug: "fuelcell",		powerName: "Fuel Cell",		plantName: "Fuel Cell Lab", suitabilityName: "Technology",
			researchCost: 20000,	constructionCost: 25000, income: 10000,	powerProduction: 50 },						
		], */
		{
			model: 	Plant,
			url:	"res/stats/power.json"
		});
	window.Plants = new _Plants();
	Plants.fetch({
		success: function(model, response, options){
			Plants.reset(response);
			
			Plants.url = null; //prevent accidentally saving to server later
			
			//Expose members through public fields
			Plants.each(function(item){
				Plants[item.get("name")] = item;
			});		
			
	
			career.researchPlantType(Plants.Solar);
		},
		error: function(model, response, options){
		}
	});		
});
