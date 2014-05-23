
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
		this.listenTo(this.model, "change:city", this.render);
		this.listenTo(ET.cities, "change", this.renderCityMarkers);
		//re-render city markers when a city is added

		/*
		var self = this;
		$(window).on('resize', function(){
		self.render();
		});
		*/

		this.stage = new Kinetic.Stage({
			container : 'canvas-map'
		});
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
		/*this.$('#map').html(this.mapTemplate({
			regionSlug : region.get('slug')
		}));*/
		
		//render map
		var image = new Image();
		var $image = $(image);
		var map = $('#map');	
		var self = this;
		$image.load(function(){
			//scale image proportionally
			var imageWidth = image.width;
			var imageHeight = image.height;
			var containerWidth = map.width();
			
			var resultWidth = Math.min(containerWidth, imageWidth);
			var resultHeight = imageHeight * resultWidth / imageWidth;
			
			self.stage.width(resultWidth);
			self.stage.height(resultHeight);
			var layer = new Kinetic.Layer();		
			var img = new Kinetic.Image({
				x : 0,
				y : 0,
				image : image,
				width : resultWidth,
				height : resultHeight
			});
			
			img.on('click', function(e) {
		    	var clickX = e.evt.layerX;
		    	var clickY = e.evt.layerY;
		    	
		    	if(region === ET.Regions.Nation){
		    		//figure out what region they clicked in, then go there
		    		//each region is bound by a rectangle; its northwest and southeast points are specified. Figure out of the clicked point lies within each region.
					var subregions = ET.Regions.filter(function(region){
						return region !== ET.Regions.Nation; //you can't zoom into the nation itself
					});
					_.each(subregions, function(region) {
						var northwest = region.get('bounds').northwest;
						var southeast = region.get('bounds').southeast;
						
						//northwest and southeast give decimals (i.e. fractions of the map's actual size); convert to real value
						var map = $('#map');
						var mapWidth = map.width();
						var mapHeight = map.height();
						
						var minX = northwest[0] * mapWidth;
						var maxX = southeast[0] * mapWidth;
						var minY = northwest[1] * mapHeight;
						var maxY = southeast[1] * mapHeight;
						
						if(minX <= clickX && clickX <= maxX && minY <= clickY && clickY <= maxY){
							ET.worldRouter.navigate("pane/map/region/" + region.get('slug'), {
								trigger : true
							});		
							return false;					
						}
					});		    		
		    	}
		    });	    

			layer.add(img);
			self.stage.removeChildren().add(layer);		
			
			self.renderCityMarkers();		
		});
		$image.attr('src', 'res/maps/resized/' +  region.get('slug') + '.png');

		var self = this;
		_.delay(function() {
			
		}, 200);

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
		this.$('.add-popover').popover();
			
		//zoom into city on click
		this.$('.city').click(function() {
			var name = $(this).data('name');
			var city = ET.cities.findWhere({
				name : name
			});
			if (city.get('owned')) {
				ET.worldRouter.navigate("pane/map/city/" + name, {
					trigger : true
				});
			}
		});
		//show info about city in sidebar on click
		//zoom into city on click
		this.$('.city').on('mouseover', function() {
			var name = $(this).data('name');
			var city = ET.cities.findWhere({
				name : name
			});
			cityGlance = new ET.CityGlanceView({ 
				model: city,
				panelWidth: 12	//show it in the sidebar, full-size
			});
			$('#city-hover-info').empty().append(cityGlance.$el);
		});		
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
