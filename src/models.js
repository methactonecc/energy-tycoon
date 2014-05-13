/**
 * Contains all the models (data stores) we need.
 */
$(function(){
	ET.timer = new ET.Timer();

	
	
	//instantiating models
	ET.map = new ET.Map();
	ET.career = new ET.Career();
	
	ET.cities = new ET.Cities();
	ET.cities.fetch({
		success: function(model, response, options){
			ET.cities.reset(response);
			
			ET.cities.url = null; //prevent accidentally saving to server later
			
			//TEMP
			ET.cities.each(function(c){
				if(c.get('region') === Regions.Northeast){
					c.set('owned',true);
				}
			});
			ET.cities.findWhere({"name": "New York"}).set('headquarters',true);
			
			ET.appView.render(); 
		},
		error: function(model, response, options){
		}
	});
	ET.career.set('cities',ET.cities);
});
