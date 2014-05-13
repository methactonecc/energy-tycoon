$(function(){
ET.MapView = Backbone.View.extend({
	/**
	 * Shows the map UI.
	 *
	 * Model: Map
	 *
	 */

	el : $('#pane-map'),

	//Template functions to use
	mapTemplate : template("template-map"), //showing a region on the map
	cityMarkerTemplate : template("template-city-marker"), //for showing all the city markers

	//Events hash
	events : {
	},

	initialize : function() {
		//Bind to relevant events here
		this.listenTo(this.model, "change:viewType", this.render);
		this.listenTo(ET.cities, "change", this.renderCityMarkers);
		//re-render city markers when a city is added

		/*
		var self = this;
		$(window).on('resize', function(){
		self.render();
		});
		*/

		//Backbone.View.prototype.constructor.apply(this, arguments);
	},

	/**
	 * Used to show the appropriate map/city info.
	 */
	render : function() {
		//get rid of old views
		if (this.cityView) {
			this.cityView.remove();
		}

		//What to show??
		var viewType = this.model.get('viewType');
		if (viewType === ET.ViewTypes.City) {
			this.renderCity();
			return;
		} else {
			//carry on
		}

		//Now we know we're doing a region

		//hide old stuff
		$('#city-view').hide();
		this.$('#map-container').show();

		//reload map to show appropriate stuff
		var region = this.model.get('region');
		this.$('#map').html(this.mapTemplate({
			regionSlug : region.get('slug')
		}));

		var self = this;
		_.delay(function() {
			self.renderCityMarkers();
			if (region === ET.Regions.Nation) {
				//zoom into a region on click
				ET.Regions.each(function(region) {
					this.$('.city-' + region.get('slug')).click(function() {
						ET.worldRouter.navigate("region/" + region.get('slug'), {
							trigger : true
						});
					});
				}, this);
			} else {
				this.$('.city').click(function() {
					var name = $(this).data('name');
					var city = cities.findWhere({
						name : name
					});
					if (city.get('owned')) {
						ET.worldRouter.navigate("city/" + name, {
							trigger : true
						});
					}
				});
			}

		}, 100);

	},

	/**
	 * Renders the markers on the map, one per city.
	 */
	renderCityMarkers : function() {
		var region = this.model.get('region');
		this.$('#city-markers').html(this.cityMarkerTemplate({
			cities : ET.cities,
			region : region
		}));
		this.$('.add-tooltip').tooltip();
	},

	/**
	 * Used to show a city.
	 */
	renderCity : function() {
		var city = this.model.get('city');
		//city to load
		this.cityView = new ET.CityView({
			model : city
		});
		this.cityView.render();
	}
});
});
