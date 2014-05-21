$(function(){
	/*
	 * Contains enums and other constants.
	 */
	
	//****************** Regions
	var Region = Backbone.Model.extend({}); //String name
	ET.Regions = new Backbone.Collection([
			{ name: "Nation",		slug: "usa" }, //entire country
			{ name: "Northeast",	slug: "northeast",		bounds: { northwest: [.772,.016], 		southeast: [.999,.448] } },
			{ name: "South",		slug: "south",			bounds: { northwest: [.366,.482], 		southeast: [.916,.992] }  },
			{ name: "Midwest",		slug: "midwest",		bounds: { northwest: [.380,.064], 		southeast: [.788,.556] }  },
			{ name: "West",			slug: "west",			bounds: { northwest: [.000,.000], 		southeast: [.384,.752] }  },
		], {
			model: Region
		});
	//Expose members through public fields; eg Regions.Northeast.
	ET.Regions.each(function(item){
		ET.Regions[item.get("name")] = item;
	});
	
	//****************** View types
	var ViewType = Backbone.Model.extend({});
	ET.ViewTypes = new Backbone.Collection([
			{ name: "Nation" },
			{ name: "Region" },
			{ name: "City" }
		], {
			model: ViewType
		});
	//Expose members through public fields
	ET.ViewTypes.each(function(item){
		ET.ViewTypes[item.get("name")] = item;
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
			model: 	ET.Plant,
			url:	"res/stats/power.json"
		});
	ET.Plants = new _Plants();
	ET.Plants.fetch({
		success: function(model, response, options){
			ET.Plants.reset(response);
			
			ET.Plants.url = null; //prevent accidentally saving to server later
			
			//Expose members through public fields
			ET.Plants.each(function(item){
				ET.Plants[item.get("name")] = item;
			});		
			
	
			ET.career.researchPlantType(ET.Plants.Solar);
		},
		error: function(model, response, options){
		}
	});	
	
	//****************** Initiatives
	/*
	 * Immutable items representing initiatives.
	 */
	var _Inits = Backbone.Collection.extend(
		{
			model: 	ET.Initiative,
			url:	"res/stats/initiatives.json"
		});
	ET.Initiatives = new _Inits();
	ET.Initiatives.fetch({
		success: function(model, response, options){
			ET.Initiatives.reset(response);
			
			ET.Initiatives.url = null; //prevent accidentally saving to server later
			
			//Expose members through public fields
			ET.Initiatives.each(function(item){
				ET.Initiatives[item.get("name")] = item;
			});		
			
			//ET.career.startInitiative(ET.Initiatives["Lab Grant"]);
		},
		error: function(model, response, options){
		}
	});		
	
	//****************** Months
	ET.Months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];
			
});
