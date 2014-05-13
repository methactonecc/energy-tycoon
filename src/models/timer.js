$(function(){
ET.Timer = Backbone.Model.extend({
	/**
	 * To keep track of the years going by. A wrapper around the $.timer object.
	 * To use, use timer.get('timer').
	 *
	 * Fields:
	 * timer - a Timer object from $.timer.
	 */
	defaults : {
		timer : $.timer(function() {
			ET.career.nextMonth();
			//step through a month at a time
		}),
		baseSpeeds : [10000, 5000, 2500], //ms between year switches for the various speed settings
	},

	initialize : function() {
	},

	/**
	 * Adjusts the speed the timer is running at. If the timer is stopped, starts it.
	 * @param {int} speedSetting Pass 0 for the base speed (slowest), 1 for a faster speed, etc. This will be mapped to the number of ms between year updates.
	 */
	setSpeed : function(speedSetting) {
		var baseSpeeds = this.get('baseSpeeds');
		this.get('timer').set({
			time : baseSpeeds[speedSetting] / 12 //we step through a month at a time
		});
		this.get('timer').play();
	},

	/**
	 * Pauses the timer.
	 */
	pause : function() {
		this.get('timer').pause();
	}
});
});