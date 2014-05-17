
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
		"click .start-initiative" : "startInitiative",			
	},

	//Template functions to use
	mainTemplate: template("template-plants"),

	initialize : function() {
		//create throttled versions of commonly-called fns
		this.render = _.throttle(this._render, 500);

		//Bind to relevant events here
		this.listenTo(this.model.get('cities'), "all change", this.render);
		this.listenTo(this.model.get('cities'), "change:plants", this.render);
	},

	_render : function() {
		this.$el.html(this.mainTemplate({
			career: this.model
		}));
	},	
});