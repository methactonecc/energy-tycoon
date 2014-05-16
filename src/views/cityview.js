
ET.CityView = Backbone.View.extend({
	/**
	 * For rendering a close-up of a city. This is ONLY rendered when you zoom in on a city.
	 *
	 * Model: City
	 */

	tagName : "div",

	events : {
		"click .build-plant" : "buildPlant",
		"click .upgrade-plant" : "upgradePlant",
		"click .repair-plant" : "repairPlant",
		"click .destroy-plant" : "destroyPlant",
		"click #move-headquarters" : "moveHeadquarters",
	},

	// Templates
	cityTemplate : template("template-city"), //for showing an up-close look at a city

	initialize : function() {
		this.listenTo(this.model, "change", this.render);
		this.listenTo(this.model.get('plants'), "all", this.render);
	},

	render : function() {
		//hide other stuff
		$('#map-container').hide();
		this.$el.html(this.cityTemplate({
			city : this.model.attributes,
			stats : ET.career
		}));
		if ($('#city-view').has(this.$el).length > 0) {
			//already contains it!
			//$('#city-view').show();
		} else {
			//add it!
			$('#city-view').append(this.$el).show();
		}
	},

	/**
	 * Begins the construction of a plant.
	 */
	buildPlant : function(event) {
		var plantTypeString = $(event.currentTarget).data('name');
		var plant = ET.Plants[plantTypeString];
		//the type of plant to build
		plant = plant.clone();
		this.model.buildPlant(plant);
	},

	/**
	 * Upgrades a plant to the next level.
	 */
	upgradePlant : function(event) {
		var plantIDString = getClickedElement(event).data('id');

		//find which plant they were referring to
		var plant = this.model.getPlantByCID(plantIDString);
		plant.upgrade();
	},

	/**
	 * Refills the plant's HP.
	 */
	repairPlant : function(event) {
		var plantIDString = getClickedElement(event).data('id');

		//find which plant they were referring to
		var plant = this.model.getPlantByCID(plantIDString);
		plant.repair();
	},

	/**
	 * Removes the plant.
	 */
	destroyPlant : function(event) {
		var plantIDString = getClickedElement(event).data('id');

		//find which plant they were referring to
		var plant = this.model.getPlantByCID(plantIDString);
		this.model.destroyPlant(plant);
	},
});
