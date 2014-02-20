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
