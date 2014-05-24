	// Utility methods
/**
 * Easy way to run templating. Frontend for _.template.
 * @param {String} source	The ID (omit the pound sign #) of the element to get templating info from.
 */
function template(source){
	return _.template($('#' + source).html());
}

/**
 * Given an event, returns the jQuery element that was clicked.
 * @param {jQuery.Event} event	an event passed from a click handler.
 */
function getClickedElement(event){
	 return $($(event)[0].currentTarget);
}

/**
  * Returns the value, but restricted to a certain range of values. 
  * constrain(500,250,400) => 400
  * constrain(500,550,1000) => 550
  * constrain(500,250,1000) => 500
  * 
  * @param {int} value		The proposed value.
  * @param {int} min		The minimum number you want the returned value to be.
  * @param {int} max		The maximum number you want the returned value to be. 
  */
function constrain(value, min, max){
	if(value > max) return max;
	if(value < min) return min;
	return value;
}

/**
 * pushLuck(.2) has a 20% chance of returning true, 80% of false
 */
function pushLuck(chance){
	return Math.random() < chance;
}


/**
 * Finds the max height of the elements in this collection and sets all elements to have that same height.
 */
$.fn.equalizeHeights = function(){
	$(this).css('height', ''); //removes any inline heights we applied so that the elements re-flow naturally
	
	var heights = $(this).map(function(i,e){
		return $(e).height();
	}); //jQuery array
	heights = heights.toArray(); //JS array
	var maxHeight = _.max(heights);
	$(this).height(maxHeight);
};