$(function(){
ET.TimerControlView = Backbone.View.extend({
	/*
	 * For rendering the buttons that control the timer.
	 */

	el : $('#timer-buttons'),

	buttonTemplate : template("template-timer-buttons"), //showing buttons to control the timer

	events : {
		"click #timer-pause" : function() {
			this.model.pause()
		},
		"click #timer-speed1" : function() {
			this.model.setSpeed(0)
		},
		"click #timer-speed2" : function() {
			this.model.setSpeed(1)
		},
	},

	render : function() {
		this.$el.html(this.buttonTemplate());
	}
});
});