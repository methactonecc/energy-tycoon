$(function(){
	/**
	 * Data on all the views.
	 */
	
	window.AppView = Backbone.View.extend({
		/**
		 * Shows the map UI.
		 * 
		 * Model: Map
		 * 
		 */
		
		el: $('#game-main'),
		
		//Template functions to use
		mapTemplate: template("template-map"),	//showing a region on the map
		cityMarkerTemplate: template("template-city-marker"),	//for showing all the city markers
		
		//Events hash
		events: {
		},
		
		initialize: function(){
			//Bind to relevant events here
    		this.listenTo(this.model, "change:region", this.render);
    		this.listenTo(this.model, "change:city", this.renderCity)
			
			/*
			var self = this;
			$(window).on('resize', function(){
				self.render();
			});
			*/
			
			//Backbone.View.prototype.constructor.apply(this, arguments);			
		},
		
		/**
		 * Used to show a map of a region.
		 */
		render: function(){
			//hide old stuff
			$('#city-view').hide();
			this.$('#map-container').show();			
			
			//reload map to show appropriate stuff
			var region = this.model.get('region');
			this.$('#map').html(this.mapTemplate({ regionSlug: region.get('slug') }));
			
			this.$('#city-markers').html(this.cityMarkerTemplate({ cities: cities, region: region }));
			
			this.$('.add-tooltip').tooltip();
			
			if(region === Regions.Nation){
				//zoom into a region on click
	    		Regions.each(function(region){
	    			this.$('.city-' + region.get('slug')).click(function(){
	    				worldRouter.navigate("region/" + region.get('slug'), { trigger: true });	
	    			});
	    		}, this);					
			}
			else{
	    		this.$('.city').click(function(){
	    			var name = $(this).data('name');
	    			worldRouter.navigate("city/" + name, { trigger: true });
	    		});			
			}
		
		},
		
		/**
		 * Used to show a city.
		 */
		renderCity: function(){
			var city = this.model.get('city'); //city to load
			var cityView = new CityView({model: city});
			cityView.render();
		}
	});
	
	window.CareerView = Backbone.View.extend({
		/**
		 * Updates the career information in the sidebar.
		 * 
		 * Model: Career
		 */
		
		el: $('#sidebar'),
		
		//Template functions to use
		statsTemplate: template("template-stats"),	//vital stats like money, power, etc.
		
		//Events hash
		events: {
		},
		
		initialize: function(){
			//Bind to relevant events here
    		this.listenTo(this.model, "change", this.renderStats);
		},
		
		renderStats: function(){
			this.$('#sidebar-stats').html(this.statsTemplate({stats: this.model.attributes}));
		},
		
		render: function(){
			//By default, re-render everything
			//Try not to use this since we want to granularize as much as possible	
			this.renderStats();	
		},		
	});
	
	window.CityView = Backbone.View.extend({	
		/**
		 * For rendering a close-up of a city. This is ONLY rendered when you zoom in on a city.
		 * 
		 * Model: City
		 */
		
		el: $('#city-view'),
		
		// Templates
		cityTemplate: template("template-city"),	//for showing an up-close look at a city		
		
		initialize: function(){
		},
		
		render: function(){
			//hide other stuff
			$('#map-container').hide();
			this.$el.show();
			this.$el.html(this.cityTemplate({city: this.model.attributes}));
		},
	});
});
