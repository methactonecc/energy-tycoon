
ET.Initiative = Backbone.Model.extend({
	defaults : {
		name : "",
		description : "",
		yearlyCost : 0,
		active: false
	},

	start: function() {
		ET.career.get('initiatives').add(this);
		this.set('active', true);
	},
	
	end: function(){
		ET.career.get('initiatives').remove(this);
		this.set('active', false);		
	}
});
