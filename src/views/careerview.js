ET.CareerView = Backbone.View.extend({
/**
* Updates the career information in the career panel.
*
* Model: Career
*/

el: $('#pane-manage'),

//Template functions to use
menuNationalTemplate: template("template-menu-national"), //menu info for when you're viewing the whole nation
menuRegionalTemplate: template("template-menu-regional"), //menu for when you're viewing one region of the US (NE, MW, etc.)
menuCityTemplate:	template("template-menu-city"), //for when you're viewing a city

//Events hash
events: {
"click #next-year": function(){ this.model.nextYear(); },
"click .research-plant-type": "researchPlantType",
"click .start-initiative": "startInitiative",
"click .add-city": "addCity",
"click #move-headquarters": "moveHeadquarters",
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
/**
* Renders the appropriate sidebar.
*/
renderMenu: function(){
//first, save the index of the current tab so we can activate it later!
var activeTabIndex = $('#sidebar-menu .nav-tabs').find('.active').index(); //PROBLEM: if you switch to another view (region -> city), the old tab index will be remembered

switch(appView.model.get('viewType')){
case ViewTypes.Nation:
var region = appView.model.get('region');
$('#sidebar-menu').html(this.menuNationalTemplate({ stats: this.model, cities: cities }));
break;
case ViewTypes.Region:
var region = appView.model.get('region');	
$('#sidebar-menu').html(this.menuRegionalTemplate({ stats: this.model, region: region, cities: cities }));
break;
case ViewTypes.City:
var city = appView.model.get('city');
$('#sidebar-menu').html(this.menuCityTemplate({ city: city }));	
}

//re-activate that tab
$('#sidebar-menu .nav-tabs').find(_.format('li:eq(<%=index%>) a', {index: activeTabIndex})).tab('show');
},

/**
* This is effectively render, but we're throttling it so that's why we have a _ in front. It's the same otherwise.
*/
_render: function(){
//By default, re-render everything
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

startInitiative: function(event){
var typeString = $(event.currentTarget).data('name');	
var init = Initiatives[typeString];
console.log(init);
this.model.startInitiative(init);	
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
