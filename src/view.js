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
    		this.listenTo(this.model, "change:viewType", this.render);
    		this.listenTo(cities, "change", this.renderCityMarkers); //re-render city markers when a city is added
			
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
		render: function(){
			//get rid of old views
			if(this.cityView){
				this.cityView.remove();
			}
						
			//What to show??
			var viewType = this.model.get('viewType');
			if(viewType ===	 ViewTypes.City){
				this.renderCity();
				return;
			}
			else{
				//carry on
			}
			
			//Now we know we're doing a region
			
			//hide old stuff
			$('#city-view').hide();
			this.$('#map-container').show();			
			
			//reload map to show appropriate stuff
			var region = this.model.get('region');
			this.$('#map').html(this.mapTemplate({ regionSlug: region.get('slug') }));
			
			var self = this;
			_.delay(function(){ 
				self.renderCityMarkers(); 		
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
		    			var city = cities.findWhere({name: name});
		    			if(city.get('owned')){
		    				worldRouter.navigate("city/" + name, { trigger: true });
		    			}
		    		});			
				}
							
			}, 100);
		
		},
		
		/**
		 * Renders the markers on the map, one per city.
		 */
		renderCityMarkers: function(){
			var region = this.model.get('region');			
			this.$('#city-markers').html(this.cityMarkerTemplate({ cities: cities, region: region }));
			this.$('.add-tooltip').tooltip();		
		},
		
		/**
		 * Used to show a city.
		 */
		renderCity: function(){
			var city = this.model.get('city'); //city to load
			this.cityView = new CityView({model: city});
			this.cityView.render();
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
		menuNationalTemplate: template("template-menu-national"), //menu info for when you're viewing the whole nation	
		menuRegionalTemplate: template("template-menu-regional"), //menu for when you're viewing one region of the US (NE, MW, etc.)
		menuCityTemplate:	  template("template-menu-city"), //for when you're viewing a city
		
		//Events hash
		events: {
			"click #next-year": 			function(){ this.model.nextYear(); },
			"click .research-plant-type": "researchPlantType",
			"click .add-city": 				"addCity",
			"click #move-headquarters": 	"moveHeadquarters",
		},
		
		initialize: function(){
			//create throttled versions of commonly-called fns
			this.render = _.throttle(this._render, 500);
			
			//Bind to relevant events here
    		this.listenTo(this.model, "change", this.render);
    		this.listenTo(this.model.get('plants'), "all", this.render);
    		this.listenTo(this.model.get('cities'), "all", this.render);
    		
    		//Intercept region changes and update menu on the sidebar accordingly
    		this.listenTo(appView.model, "change:viewType", this.renderMenu);
		},
		
		renderStats: function(){
			this.$('#sidebar-stats').html(this.statsTemplate({ stats: this.model, cities: cities }));
		},
		
		/**
		 * Renders the appropriate sidebar.
		 */
		renderMenu: function(){
			//first, save the index of the current tab so we can activate it later!
			var activeTabIndex = $('#sidebar-menu .nav-tabs').find('.active').index(); //PROBLEM: if you switch to another view (region -> city), the old tab index will be remembered
			
			switch(appView.model.get('viewType')){
				case ViewTypes.Nation:
					var region = appView.model.get('region');
					this.$('#sidebar-menu').html(this.menuNationalTemplate({ stats: this.model, cities: cities }));
					break;
				case ViewTypes.Region:
					var region = appView.model.get('region');				
					this.$('#sidebar-menu').html(this.menuRegionalTemplate({ stats: this.model, region: region, cities: cities }));
					break;
				case ViewTypes.City:
					var city = appView.model.get('city');
					this.$('#sidebar-menu').html(this.menuCityTemplate({ city: city }));					
			}
			
			//re-activate that tab
			$('#sidebar-menu .nav-tabs').find(_.format('li:eq(<%=index%>) a', {index: activeTabIndex})).tab('show');
		},
		
		/**
		 * This is effectively render, but we're throttling it so that's why we have a _ in front. It's the same otherwise.
		 */
		_render: function(){
			//By default, re-render everything
			this.renderStats();	
			this.renderMenu();
			//this.renderRegionalMenu();
		},	
		
		
		/**
		 * Researches a clicked power type.
		 */
		researchPlantType: function(event){
			var plantTypeString = $(event.currentTarget).data('name');	
			var plant = Plants[plantTypeString];
			plant = plant.clone();
			this.model.researchPlantType(plant);
		},

		/**
		 * Expands to a certain city.
		 */		
		addCity: function(event){
			var cityName = $(event.currentTarget).data('name');	
			var city = cities.findWhere({name: cityName});
			this.model.expandToCity(city);	
		},
		
		
		/**
		 * Moves the player's headquarters to the active city.
		 */
		moveHeadquarters: function(event){
			//this can only be clicked from the city view, so the city to move to IS the city being shown
			var city = map.get('city');	
			cities.setHeadquarters(city);
		},		
	});
	
	window.CityView = Backbone.View.extend({	
		/**
		 * For rendering a close-up of a city. This is ONLY rendered when you zoom in on a city.
		 * 
		 * Model: City
		 */
		
		tagName: "div",
		
		events: {
			"click .build-plant": "buildPlant",
			"click .upgrade-plant": "upgradePlant",
			"click .repair-plant": "repairPlant",			
			"click .destroy-plant": "destroyPlant",
			"click #move-headquarters": "moveHeadquarters",
		},
		
		// Templates
		cityTemplate: template("template-city"),	//for showing an up-close look at a city		
		
		initialize: function(){
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model.get('plants'), "all", this.render);			
		},
		
		render: function(){
			//hide other stuff
			$('#map-container').hide();
			this.$el.html(this.cityTemplate({city: this.model.attributes, stats: career }));
			if($('#city-view').has(this.$el).length > 0){
				//already contains it!
				//$('#city-view').show();
			}
			else{
				//add it!
				$('#city-view').append(this.$el).show();
			}
		},
		
		/**
		 * Begins the construction of a plant.
		 */
		buildPlant: function(event){
			var plantTypeString = $(event.currentTarget).data('name');
			var plant = Plants[plantTypeString]; //the type of plant to build
			plant = plant.clone();
			this.model.buildPlant(plant);
		},
		
		/**
		 * Upgrades a plant to the next level.
		 */
		upgradePlant: function(event){
			var plantIDString = getClickedElement(event).data('id');

			//find which plant they were referring to
			var plant = this.model.getPlantByCID(plantIDString);
			plant.upgrade();
		},		
		
		/**
		 * Refills the plant's HP.
		 */
		repairPlant: function(event){
			var plantIDString = getClickedElement(event).data('id');

			//find which plant they were referring to
			var plant = this.model.getPlantByCID(plantIDString);
			plant.repair();
		},			
		
		/**
		 * Removes the plant.
		 */
		destroyPlant: function(event){
			var plantIDString = getClickedElement(event).data('id');

			//find which plant they were referring to
			var plant = this.model.getPlantByCID(plantIDString);
			this.model.destroyPlant(plant);
		},
	});
	
	
	window.TimerControlView = Backbone.View.extend({
		/*
		 * For rendering the buttons that control the timer.
		 */
		
		el: $('#timer-buttons'),
		
		buttonTemplate: template("template-timer-buttons"),		//showing buttons to control the timer	
		
		events: {
			"click #timer-pause": 			function(){ this.model.pause() },
			"click #timer-speed1": 			function(){ this.model.setSpeed(0) },
			"click #timer-speed2": 			function(){ this.model.setSpeed(1) },
		},
		
		render: function(){
			this.$el.html(this.buttonTemplate());			
		}
	});
});
