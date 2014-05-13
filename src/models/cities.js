ET.Cities = Backbone.Collection.extend({
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
* @param {City} city the new headquarters.
*/
setHeadquarters: function(city){
if(career.spendMoney(city.getHeadquarterCost())){
this.findWhere({ headquarters: true }).set('headquarters', false);
city.set('headquarters', true);	
}
}
});
