$(function(){
	/**
	 * Data on all the views.
	 */
	
	window.AppView = Backbone.View.extend({
		/**
		 * Shows most of the UI, including maps and info.
		 * 
		 */
		
		el: $('#game-main'),
		
		//Template functions to use
		mapTemplate: template("template-map"),
		cityTemplate: template("template-city"),
		
		//Events hash
		events: {
			"click #map": 	"loadNE",
			"dblclick #map":"loadW"
		},
		
		initialize: function(){
			//Bind to relevant events here
    		this.listenTo(this.model, "change", this.render);			
			
			var self = this;
			$(window).on('resize', function(){
				self.render();
			});
			
			//Backbone.View.prototype.constructor.apply(this, arguments);			
		},
		
		render: function(){
			//reload map to show appropriate stuff
			var region = this.model.get('region');
			this.$('#map').html(this.mapTemplate({ regionSlug: region.get('slug') }));
			
			//var isShowingNation = region === Regions.Nation;
			//if(isShowingNation){
				////render each city with national coords
				this.$('#cities').html(this.cityTemplate({ cities: cities, region: region }));
			//}//
			
			
			this.$('.add-tooltip').tooltip();
		},
		
		//Listening to events
		loadNE: function(){
			//this is a test!
			worldRouter.navigate("region/northeast", { trigger: true });
			//this.render();
		},
		loadW: function(){ worldRouter.navigate("region/west", {trigger:true})}
	});
});
