$(function() {
	ET.SidebarView = Backbone.View.extend({
		/*
		 Handles career stuff in the sidebar only.

		 Model: career
		 */
		el : $('#sidebar'),

		//Template functions to use
		statsTemplate : template("template-stats"), //vital stats like money, power, etc.

		initialize : function() {
			//create throttled versions of commonly-called fns
			this.render = _.throttle(this._render, 500);

			//Bind to relevant events here
			this.listenTo(this.model, "all", this.render);
			this.listenTo(this.model.get('plants'), "all", this.render);
			this.listenTo(this.model.get('cities'), "all", this.render);

			//Intercept region changes and update menu on the sidebar accordingly
			//this.listenTo(ET,.appView.model, "change:viewType", this.renderMenu);
		},

		_render : function() {
			this.$('#sidebar-stats').html(this.statsTemplate({
				stats : this.model,
				cities : ET.cities
			}));
		},
	});
}); 