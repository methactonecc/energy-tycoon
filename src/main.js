$(function(){
	/**
	 * Main method and start of app
	 */
	
	//init models
	ET.timer = new ET.Timer();
	ET.loan = new ET.Loan();
	
	
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
				if(c.get('region') === ET.Regions.Northeast){
					c.set('owned',true);
				}
			});
			ET.cities.findWhere({"name": "New York"}).set('headquarters',true);
			
			ET.mapView.render(); 
		},
		error: function(model, response, options){
		}
	});
	ET.career.set('cities',ET.cities);	
	
	
	
	ET.newsReel = new ET.NewsReel();
	
	
	//ALL MODEL INITIATION SHOULD BE DONE BY NOW
	
	//init view
	ET.mapView = new ET.MapView({ model: ET.map });	
	//ET.careerView = new ET.CareerView({ model: ET.career });
	//ET.careerView.render();
	ET.sidebarView = new ET.SidebarView({ model: ET.career });
	ET.sidebarView.render();
	ET.timerControlView = new ET.TimerControlView({ model: ET.timer });
	ET.timerControlView.render();
	ET.businessView = new ET.BusinessView({ model: ET.career });
	ET.businessView.render();
	ET.plantsView = new ET.PlantsView({ model: ET.career });
	ET.plantsView.render();
	//appView.render();
	
	ET.worldRouter = new ET.WorldRouter();
	Backbone.history.start({
	//pushState: true,
	});
	ET.worldRouter.navigate("pane/map", { trigger: true });

}); 
