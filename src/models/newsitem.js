ET.NewsItem = Backbone.Model.extend({
	/**
	 * A news item aka a persistent event. These pop up every so often and impact your game while they're in effect.
	 * Each of these applies to, max, one city. So it'll have access to its own city.
	 * Each of these will stick around in the news item reel for a certain amount of time.
	 * 
	 * Variables:
	 * 	String name
	 * 	String description		A template-powered string that contains the text that will be shown to the user. We'll pass {city: this.city, career: ET.career} to the template; so you can write "<%=city.get('name')%> grows quickly" and it'll become like "New York grows quickly"
	 * 	int connotation			Whether the item is good, bad, or neutral. +2 = good, +1 = it depends, 0 = neutral (i.e. this is a funny, random news story), -1 = bad
	 * 	const int DURATION		the maximum amount of time this item can be active for, in MONTHS. (constant)
	 * 	int monthsLeft			the amount of time this item is active for (this counts down till it gets deactivated)
	 * 	City city				the city this news item is affecting.
	 * 
	 * Public Functions:
	 * 	void activate			Makes this item start.
	 * 	boolean isActive		Returns true if this item is ongoing
	 * 	boolean isActiveFor		Returns true if this item is currently on and is affecting the given city. Cities should call this to see if this news item is affecting them
	 */
	defaults : {
		name : "",
		description : "",
		DURATION: 0,
		connotation: 0,
		city: null,
		
		monthsLeft: 0
	},
	
	/**
	 * Turns on this news item.
	 */
	activate: function(city){
		this.set('city', city);
		this.set('monthsLeft', this.get('DURATION'));
		
		//pop onto the news reel
		ET.newsReel.add(this);
		
		return this.get('monthsLeft'); //convenience
	},
	
	/**
	 * Turns off this news item. PRIVATE.
	 */
	deactivate: function(){
		this.set('monthsLeft', 0);
		
		//take off the news reel
		ET.newsReel.remove(this);
	},

	isActive: function(){
		return this.get('monthsLeft') > 0;
	},
	
	isActiveFor: function(city){
		return this.isActive() && this.get('city') === city;
	},
	
	passMonth: function(){
		this.set('monthsLeft', this.get('monthsLeft') - 1); //monthsLeft--
		if(this.get('monthsLeft') <= 0){
			this.deactivate();
		}
	},
	
	getText: function(){
		var text = _.template(this.get('description'), { 
			city: this.get('city'), 
			career: ET.career 
		});
		
		return text;
	}
});
