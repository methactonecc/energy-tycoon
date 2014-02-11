$(function(){
	/*
	 * Contains enums and other constants.
	 */
	
	//Regions
	var Region = Backbone.Model.extend({}); //String name
	var Regions = new Backbone.Collection([
			{ name: "Northeast" },
			{ name: "South" },
			{ name: "Midwest" },
			{ name: "West" },
		], {
			model: Region
		});
	//Expose members through public fields; eg Regions.Northeast.
	Regions.each(function(item){
		Regions[item.get("name")] = item;
	});
	
});
