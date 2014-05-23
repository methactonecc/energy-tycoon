
	ET.SidebarView = Backbone.View.extend({
		/*
		 Handles career stuff in the main sidebar only.

		 Model: career
		 */
		el : $('#sidebar'),

		//Template functions to use
		statsTemplate : template("template-stats"), //vital stats like money, power, etc.
		newsTemplate: template("template-sidebar-news"),	//a condensed view of the news reel

		initialize : function() {
			//create throttled versions of commonly-called fns
			this.render = _.throttle(this._render, 500);

			//Bind to relevant events here
			this.listenTo(this.model, "all", this.render);
			this.listenTo(this.model.get('plants'), "all", this.render);
			this.listenTo(this.model.get('cities'), "all", this.render);
			this.listenTo(this.model.get('initiatives'), "all", this.render);
			this.listenTo(ET.newsReel, "all", this.renderNews);

			//Intercept region changes and update menu on the sidebar accordingly
			//this.listenTo(ET,.appView.model, "change:viewType", this.renderMenu);
		},

		_render : function() {
			this.$('#sidebar-stats').html(this.statsTemplate({
				stats : this.model,
				cities : ET.cities
			}));
		},
		
		renderNews: function(){
			this.$('#sidebar-news').html(this.newsTemplate({
				news: ET.newsReel.last(3) //show the last few news items
			}));
	        	
		}
	});