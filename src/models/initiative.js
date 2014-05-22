
ET.Initiative = Backbone.Model.extend({
	defaults : {
		name : "",
		description : "",
		yearlyCost : 0
	},

	initialize : start() {
		ET.Career.startInitiative(this),
		
	},
});
