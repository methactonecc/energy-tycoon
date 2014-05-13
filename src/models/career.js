ET.Career = Backbone.Model.extend({
/**
* Information about you, the player.
*
* Fields:
* int money
* int year the current round (known as a year.) Starts at 1.
* String name
* Collection<Plant> plants a list of plant types the user has researched. NOT the same as the Plants enum.
* Cities cities the list of all cities. Will be modified as they develop.
*/	

defaults: {
money:	1000000,
year:	1,
month:	1,
name:	"Neel",
initiatives : new Backbone.Collection([]),
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
* @param {int} amount How much money to spend. Positive.
* @param {boolean} force [optional, default false] Pass true if this expense is MANDATORY (like interest on a loan.) If the user can't afford it, then instead of failing, the user goes into debt. Effectively this overrides the min-cash limit.
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
* Either adds or subtracts money from your coffers.
* Shortcut method. Use this if you're not sure if the amount you're passing is positive or negative.
* @param {int} amount if positive, you gain money; if negative, you lose money (the expenditure will be forced, meaning that you may go into the red.)
*/
changeMoney: function(amount){
if(amount > 0){
this.gainMoney(amount);
}
else{
this.spendMoney(-amount, true);
}
},

/**
* Increments the year. Skips any months in between now and January of the next year.
*/
nextYear: function(){
this.set('year',this.get('year')+1);
this.set('month', 1);
this.changeMoney(this.getIncome()); //+-cash for this year
cities.each(function(city){
city.get('plants').each(function(plant){
plant.set("hp", plant.get("hp") - 5); // arbitrary; change hp loss amount
});

});

},

/**
* Increments the month, which may lead to the year rolling over.
*/
nextMonth: function(){
var month = this.get('month');
if(month == 12){
this.set('month', 1);
this.nextYear();
}
else{
this.set('month', month+1);
}
},

/**
* Returns the amount of money you earn each year from all of your plants/cities, minus your outlays for initiatives.
*/
getIncome: function(){
var revenue = cities.reduce(function(sum, city){
return sum + city.getIncome();
}, 0);
var expenditures = this.get('initiatives').reduce(function(sum, init){
return sum + init.get("yearlyCost");
}, 0);
return revenue - expenditures;
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

/**
* Begins the given initiative.
*/
startInitiative: function(init){
this.get('initiatives').add(init);
},


/* Getters */
getHeadquarters: function(){
return this.get('cities').getHeadquarters();
}

});
