// Utility methods
/**
 * Easy way to run templating. Frontend for _.template.
 * @param {String} source	The ID (omit the pound sign #) of the element to get templating info from.
 */
function template(source){
	return _.template($('#' + source).html());
}
