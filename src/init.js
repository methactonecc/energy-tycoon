
	/*
	 * Bare minimum startup/groundwork code. Start the app in main.js... this is just to prepare for loading the other files.
	 */
	
	window.ET = {}; //new app namespace instead of window	
	
	//Underscore custom mixins!
	_.mixin({
		/**
		 * Makes String interpretation a lot easier.
		 * Usage: _.format("Hi, <%=name%>", {name: "Lorax"}) -> "Hi, Lorax" 
		 * @param {String} string	Contains variables mixed with normal text, with variables wrapped in: <%= ... %>
		 * @param {Object} object	Contains name-value pairs. The name matches with the variable named in string, and the value is what it's replaced with.
		 * @return	{String}	An interpolated string.
		 */
		  format: function(string, object) {
		    return (_.template(string))(object);
		  },
		  
		  /**
		   * Randomly chooses an item from a collection.
		   */
		  randomFrom: function(collection){
		  	return collection.at(_.random(0, collection.length-1));
		  }
	});	