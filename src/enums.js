$(function(){
	/*
	 * Contains enums and other constants.
	 */
	
	//Regions
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
	
});
