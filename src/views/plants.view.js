
ET.PlantsView = Backbone.View.extend({
	/*
	 For the Plants tab.
	 Manages plants and the cities they're located in.
	 
	 Model: ET.career
	 
	 TODO maybe restrict it to just ET.career.cities??
	 */
	el : $('#pane-plants'),
	
	events: {
		"click #btn-set-headquarters": "setHeadquarters",
		"click .research-plant-type" : "researchPlantType",
		"click .btn-city-expand" : "expandToCity",			
	},

	//Template functions to use
	mainTemplate: template("template-plants"),

	initialize : function() {
		//create throttled versions of commonly-called fns
		this.render = _.throttle(this._render, 500);

		//Bind to relevant events here
		this.listenTo(this.model.get('cities'), "change change:plants", this.render);
		
		this.render();
	},

	_render : function() {
		this.$el.html(this.mainTemplate({
			career: this.model
		}));
		$('.city-tile').equalizeHeights(); 
	},	
	
	expandToCity: function(event){
		var cityName = $(event.currentTarget).data('name');		
		var city = ET.cities.findWhere({ "name": cityName });
		this.model.expandToCity(city);
	}
});