/**
 * Contains all the models (data stores) we need.
 */
$(function(){

	
	window.Plant = Backbone.Model.extend({
		/**
		 * A power plant.
		 * 
		 * Static fields:
		 * 	String name			the internal name.
		 * 	String slug			the short form used for retrieving images. Usually it's the name minus spaces, and lowercased.
		 * 	String powerName	the name for the kind of power that's produced.
		 * 	String plantName	the name for the actual plant.
		 * 	int researchCost	Cost (in dollars) to research this plant type
		 * 	int constructionCost	Cost (in dollars) to build the plant or upgrade it
		 * 	
		 * 	Dynamically-generated fields:
		 * 		int income				how much money you earn each year from this plant.
		 * 		int powerProduction		how much power this generates.
		 * 
		 * 	When constructed:
		 * 	Object[] levels		each object within this array represents a certain level; each level has its own income and power powerProduction. for instance:
		 * 		levels[0] (level 1 stats) = { income: 5, power: 20 }
		 * 
		 * Dynamic fields:
		 * 	int level			up to 3. //TODO make income/powerprod change as level changes
		 * 	int hp				how much endurance this plant has; wears down over time. Max 100 (full health); min 0.
		 * 	City city			the city that this plant has been placed in.
		 */
		
		defaults: {
			level:	1,
			hp:		100,
			city:	null
		},
		
		/* Computed properties */
		
		getIncome: function(){
			var levelStats = this.get('levels')[this.get('level')-1];
			var baseIncome = levelStats.income;
			var income = baseIncome;
			
			//headquarters boost
			if(this.get('city') && this.get('city').get('headquarters')){
				income *= 1.25;
			}
			
			//suitability change
			if(this.get('city')){
				var suitabilityObject = this.get('city').get('suitability');
				var suitability = suitabilityObject[this.get('slug')]; //1-5
				income *= 1 + (suitability-3)*0.05;
			}

			
			return Math.round(income);
		},
		
		getPowerProduction: function(){
			var levelStats = this.get('levels')[this.get('level')-1];
			var basePower = levelStats.power;
			var power = basePower;

			//headquarters boost
			if(this.get('city') && this.get('city').get('headquarters')){
				power *= 1.15;
			}
			
			//suitability change
			if(this.get('city')){
				var suitabilityObject = this.get('city').get('suitability');
				var suitability = suitabilityObject[this.get('slug')]; //1-5
				power *= 1 + (suitability-3)*0.10;
			}			
			
			return Math.round(power);			
		},
		
		getDestructionCost: function(){
			return this.get('constructionCost')/2;
		},
		
		getRepairCost: function(){
			return this.get('constructionCost')/5;
		},		
		
		/**
		 * Moves this plant up a level.
		 */
		upgrade: function(){
			// can we even level up?
			var maxLevel = this.get('levels').length;
			if(this.get('level') < maxLevel){
				if(career.spendMoney(this.get('constructionCost'))){
					this.set('level', this.get('level') + 1);
					return true;
				}		
				return false;
			}
			return false;
		},
		
		/**
		 * Refills this plant's HP at a price.
		 */
		repair: function(){
			if(career.spendMoney(this.getRepairCost())){
				this.set('hp', 100); //arbitrary max
			}
		},
	});	
	
	var Initiative = Backbone.Model.extend({
		defaults: {
			name: "test",
			description: "test1",
			yearlyCost: 3000
		}
	});
	
	var Career = Backbone.Model.extend({
		/**
		 * Information about you, the player.
		 * 
		 * Fields:
		 * 	int money
		 * 	int year					the current round (known as a year.) Starts at 1.
		 * 	String name
		 * 	Collection<Plant> plants	a list of plant types the user has researched. NOT the same as the Plants enum.	
		 *  Cities cities				the list of all cities. Will be modified as they develop.
		 */	
		 
		 defaults: {
			 money:	1000000,
			 year:	1,
			 name:	"Neel",
			 initiatives : new Backbone.Collection([ new Initiative ]),
			 plants: new Backbone.Collection
		 },
		 
		 /* Functions */
		
		/**
		 * You gain money.
		 */
		gainMoney: function(amount){
			this.set('money',this.get('money') + amount);
		},
		
		/**
		 * Attempts to spend money on a project, plant, city, etc. If you have enough money, deducts it from your total and returns true; otherwise returns false.
		 * @param {int} amount	How much money to spend. Positive.
		 * @param {boolean} force	[optional, default false] Pass true if this expense is MANDATORY (like interest on a loan.) If the user can't afford it, then instead of failing, the user goes into debt. Effectively this overrides the min-cash limit.
		 */
		spendMoney: function(amount, force){
			if(this.get('money') < amount && force !== true){
				//fail!
				return false;
			}
			else{
				this.set('money',this.get('money') - amount);
				return true;
			}
		},
		
		/**
		 * Increments the year.
		 */
		nextYear: function(){
			this.set('year',this.get('year')+1);
			this.gainMoney(this.getIncome()); //+cash for this year
			cities.each(function(city){
				city.get('plants').each(function(plant){
					plant.set("hp", plant.get("hp") - 5); // arbitrary; change hp loss amount
				});
				
			});
			/*this.initiatives.each(function(i){
				this.spendMoney(i.get("yearlyCost"), true); //mandatory expenditure
			});*/
				
		},
		
		/**
		 * Returns the amount of money you earn each year from all of your plants/cities.
		 */
		getIncome: function(){
			return cities.reduce(function(sum, city){
				return sum + city.getIncome();
			}, 0);
		},
				
		/**
		 * Returns the amount of power, in GWh, that are produced by all the cities/plants put together.
		 */
		getPower: function(){
			return cities.reduce(function(sum, city){
				return sum + city.getPower();
			}, 0);
		},
		
		/**
		 * Returns - as an int from 0 to 100 - what percent of the power that is needed to win is currently being generated.
		 */
		getPowerPercent: function(){
			//TODO make constant
			return Math.round(this.getPower()/1000*100);
		},
		
		
		/* 
		 * Adds the given plant type to the list of plants we can build.
		 */
		researchPlantType: function(plant){
			if(this.spendMoney(plant.get('researchCost'))){
				this.get('plants').add(plant);
			}
		},
		
		/**
		 * Takes ownership of the given city.
		 */
		expandToCity: function(city){
			if(this.spendMoney(city.get('expansionCost'))){
				city.set('owned', true);
			}
		},		
		
	});
	
	var Map = Backbone.Model.extend({
		/*
		 * Houses information about the map's current state.
		 * 
		 * Fields:
		 * 	Region region	(active region)
		 * 	City city		(active city)
		 * 	ViewType viewType	the part of the map the user is currently looking at: nation, region, city.
		 */
	});
	
	var City = Backbone.Model.extend({
		/*
		 * Data for an individual city, where you can build plants.
		 * Fields:
		 *  String name
		 * 	bool owned (by player)
		 *  bool headquarters
		 * 	Collection<Plant> plants	(up to 3) plants in this city.
		 * 	int expansionCost			how much money it costs to unlock this city.
		 * 	Object suitability			Keeps track of how well each power type does in this city. Contains fields {"solar": 1-5, "fuelcell": 1-5, ... } (uses the power sources' slugs)
		 *	Region region (see Regions enum)
		 * 	int[] nationalCoords		coordinates of city on the national map in form [x,y] where x and y are in percents from top left (in decimal form)
		 * int[] regionalCoords			coordinates for the region they're in. Same format as national.
		 * 
		 * In constructor, pass:
		 * 	String name
		 * 	String regionName ("Northeast", "West", etc.)
		 * 	int[] nationalCoords
		 * 	int[] regionalCoords
		 */
		
		defaults: function(){
			return {
			 owned: 	false,
			 headquarters: false,	
			 plants:	new Backbone.Collection,
			 expansionCost:	20000	
			};
		},
		
		constructor: function(){
			Backbone.Model.prototype.constructor.apply(this, arguments);
			
			if(this.get('regionName')){
				this.set('region', Regions[this.get('regionName')]);
			}
		},
		
		
		/**
		 * Returns the annual income of the sum of this city's power plants.
		 */
		getIncome: function(){
			return _.reduce(this.get('plants').pluck('income'), function(sum, x){ return sum + x; }, 0);			
		},
		
		/**
		 * Returns the amount of power (in GWh) generated by the sum of this city's power plants.
		 */
		getPower: function(){
			return _.reduce(this.get('plants').pluck('powerProduction'), function(sum, x){ return sum + x; }, 0);
		},		
		
		/**
		 * Returns how much money it would take to make this city your headquarters.
		 */
		getHeadquarterCost: function(){
			return this.get('expansionCost') * 2;
		},
		
		/*
		 * Constructs the given plant in this city NOW.
		 */
		buildPlant: function(plant){
			if(career.spendMoney(plant.get('constructionCost'))){
				this.get('plants').add(plant);
				plant.set('city', this);				
			}

		},
		
		/*
		 * Destroys the given plant in this city NOW.
		 */
		destroyPlant: function(plant){
			if(career.spendMoney(plant.getDestructionCost())){
				this.get('plants').remove(plant);
			}
		},
		
		/**
		 * Convenience method that returns the one plant whose cid matches the given one.
		 */
		getPlantByCID: function(cid){
			var plants = this.get('plants').filter(function(plant){ return plant.cid === cid });
			return plants[0];
		}
	});
	
	var Cities = Backbone.Collection.extend({
		/*
		 * List of cities.
		 */
		
		model: City,
		
		url: 'res/stats/cities.json',

		//TODO do the headquarters fns make more sense as part of career?
		/**
		 * Returns the City object representing the player's headquarters
		 */
		getHeadquarters: function(){
			return this.findWhere({ headquarters: true });
		},		

		/**
		 * Changes the player's headquarters. The old headquarters will be removed.
 		 * @param {City} city	the new headquarters.
		 */
		setHeadquarters: function(city){
			if(career.spendMoney(city.getHeadquarterCost())){
				this.findWhere({ headquarters: true }).set('headquarters', false);
				city.set('headquarters', true);				
			}
		}
	});
	
	var Timer = Backbone.Model.extend({
		/**
		 * To keep track of the years going by. A wrapper around the $.timer object.
		 * To use, use timer.get('timer').
		 * 
		 * Fields:
		 * 	timer - a Timer object from $.timer.
		 */
		defaults: {
			timer: $.timer(function(){
				career.nextYear();
			}),
			baseSpeeds: [ 10000, 5000, 2500 ], //ms between year switches for the various speed settings
		},
		
		initialize: function(){
		},
		
		/**
		 * Adjusts the speed the timer is running at. If the timer is stopped, starts it.
 		 * @param {int} speedSetting	Pass 0 for the base speed (slowest), 1 for a faster speed, etc. This will be mapped to the number of ms between year updates.
		 */
		setSpeed: function(speedSetting){
			var baseSpeeds = this.get('baseSpeeds');
			this.get('timer').set({ 
				time: baseSpeeds[speedSetting]
			});
			this.get('timer').play();
		},
		
		/**
		 * Pauses the timer.
		 */
		pause: function(){
			this.get('timer').pause();
		}
	});
	window.timer = new Timer();

	
	
	//instantiating models
	window.map = new Map();
	window.career = new Career();
	
	window.cities = new Cities();
	cities.fetch({
		success: function(model, response, options){
			cities.reset(response);
			
			cities.url = null; //prevent accidentally saving to server later
			
			//TEMP
			cities.each(function(c){
				if(c.get('region') === Regions.Northeast){
					c.set('owned',true);
				}
			});
			cities.findWhere({"name": "New York"}).set('headquarters',true);
			
			appView.render(); 
		},
		error: function(model, response, options){
		}
	});
	career.set('cities',cities);
});
