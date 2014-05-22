
ET.Initiative = Backbone.Model.extend({
	defaults : {
		name : "",
		description : "",
		yearlyCost : 0
	},

	start: function() {
		ET.Career.startInitiative(this),
	},
});
