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
		},
		
		initialize: function(){
			//Bind to relevant events here
			this.render();
			
			var self = this;
			$(window).on('resize', function(){
				self.render();
			});
		},
		
		render: function(){
			//reload map to show appropriate stuff
			this.$('#map').html(this.mapTemplate({ regionSlug: region.get('slug') }));
			
			//var isShowingNation = region === Regions.Nation;
			//if(isShowingNation){
				////render each city with national coords
				this.$('#cities').html(this.cityTemplate({ cities: cities, region: region }));
			//}//
		},
		
		//Listening to events
		loadNE: function(){
			//this is a test!
			region = Regions.Northeast;
			this.render();
		}
	});
});
