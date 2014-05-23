ET.CityGlanceView = Backbone.View.extend({
	/**
	 * Shows information about a city at a glance. Great for sidebars.	
	 *
	 * Model: City
	 */

	tagName: "div",

	events : {
	},
	
	options: {
		panelWidth:	12	//How wide to make the panel this is stored in (for lg, md). Always 12 for sm,xs. TODO make this an array to allow more flexibility ([lg,md,sm,xs])
	},

	// Templates
	cityTemplate : template("template-city-glance"), //for showing an up-close look at a city

	initialize : function() {
		this.listenTo(this.model, "change", this.render);
		
		this.render();
	},

	render : function() {
		this.$el.html(this.cityTemplate({
			city : this.model,
			options:	this.options
		}));
	}
});
