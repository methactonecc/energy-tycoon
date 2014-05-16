
	ET.BusinessView = Backbone.View.extend({
		/*
		 Handles information about the business in the Business Info tab.
		 
		 Model: ET.career
		 */
		el : $('#pane-manage'),
		
		events: {
			"click #btn-set-headquarters": "setHeadquarters"
			
		},

		//Template functions to use
		businessTemplate : template("template-business-info"),

		initialize : function() {
			//create throttled versions of commonly-called fns
			this.render = _.throttle(this._render, 0);

			//Bind to relevant events here
			this.listenTo(this.model, "all", this.render);
			this.listenTo(this.model.get('plants'), "all", this.render);
			this.listenTo(this.model.get('cities'), "all", this.render);
		},

		_render : function() {
			this.$el.html(this.businessTemplate({
				career: this.model,
				cities: ET.cities
			}));
		},
		
		
		/**
		 * Moves the headquarters, if possible.
		 */
		setHeadquarters: function(event) {
			var cityName = $('#select-choose-headquarters').val();
			ET.cities.setHeadquarters(ET.cities.findWhere({"name": cityName}));
			this.render();
		},		
	});