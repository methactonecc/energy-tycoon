$(function() {

	ET.Plant = Backbone.Model.extend({
		/**
		 * A power plant.
		 *
		 * Static fields:
		 * String name the internal name.
		 * String slug the short form used for retrieving images. Usually it's the name minus spaces, and lowercased.
		 * String powerName the name for the kind of power that's produced.
		 * String plantName the name for the actual plant.
		 * int researchCost Cost (in dollars) to research this plant type
		 * int constructionCost Cost (in dollars) to build the plant or upgrade it
		 *
		 * Dynamically-generated fields:
		 * int income how much money you earn each year from this plant.
		 * int powerProduction how much power this generates.
		 *
		 * When constructed:
		 * Object[] levels each object within this array represents a certain level; each level has its own income and power powerProduction. for instance:
		 * levels[0] (level 1 stats) = { income: 5, power: 20 }
		 *
		 * Dynamic fields:
		 * int level up to 3. //TODO make income/powerprod change as level changes
		 * int hp how much endurance this plant has; wears down over time. Max 100 (full health); min 0.
		 * City city the city that this plant has been placed in.
		 */

		defaults : {
			level : 1,
			hp : 100,
			city : null
		},

		/* Computed properties */

		getIncome : function() {
			var levelStats = this.get('levels')[this.get('level') - 1];
			var baseIncome = levelStats.income;
			var income = baseIncome;

			//headquarters boost
			if (this.get('city') && this.get('city').get('headquarters')) {
				income *= 1.25;
			}

			//suitability change
			if (this.get('city')) {
				var suitabilityObject = this.get('city').get('suitability');
				var suitability = suitabilityObject[this.get('slug')];
				//1-5
				income *= 1 + (suitability - 3) * 0.05;
			}

			return Math.round(income);
		},

		getPowerProduction : function() {
			var levelStats = this.get('levels')[this.get('level') - 1];
			var basePower = levelStats.power;
			var power = basePower;

			//headquarters boost
			if (this.get('city') && this.get('city').get('headquarters')) {
				power *= 1.15;
			}

			//suitability change
			if (this.get('city')) {
				var suitabilityObject = this.get('city').get('suitability');
				var suitability = suitabilityObject[this.get('slug')];
				//1-5
				power *= 1 + (suitability - 3) * 0.10;
			}

			return Math.round(power);
		},

		getDestructionCost : function() {
			return this.get('constructionCost') / 2;
		},

		getRepairCost : function() {
			return this.get('constructionCost') / 5;
		},

		/**
		 * Moves this plant up a level.
		 */
		upgrade : function() {
			// can we even level up?
			var maxLevel = this.get('levels').length;
			if (this.get('level') < maxLevel) {
				if (career.spendMoney(this.get('constructionCost'))) {
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
		repair : function() {
			if (career.spendMoney(this.getRepairCost())) {
				this.set('hp', 100);
				//arbitrary max
			}
		},
	});
});
