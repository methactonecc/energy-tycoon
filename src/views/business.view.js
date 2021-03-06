
	ET.BusinessView = Backbone.View.extend({
		/*
		 Handles information about the business in the Business Info tab.
		 
		 Model: ET.career
		 */
		el : $('#pane-manage'),
		
		events: {
			"click #btn-set-headquarters": "setHeadquarters",
			"click .research-plant-type" : "researchPlantType",
			"click .start-initiative" : "startInitiative",		
			"click .end-initiative": 	"endInitiative"	
		},

		//Template functions to use
		tInitiatives: template("template-business-initiatives"),
		tResearch: template("template-business-research"),
		tCities: template("template-business-cities"),

		initialize : function() {
			//create throttled versions of commonly-called fns
			this.render = _.throttle(this._render, 50);

			//Bind to relevant events here
			//this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model.get('plants'), "all", this.renderResearch);
			this.listenTo(this.model.get('cities'), "all", this.render);
			//this.listenTo(ET.Initiatives, "change:active", this.renderInitiatives);
			this.listenTo(ET.Initiatives, "change:active", this.render);
			
			this.loanView = new ET.LoanView({ model: ET.loan });
			this.loanView.render();
		},

		_render : function() {
			this.renderInitiatives();		
			this.renderResearch();
			this.renderCities();		
			this.renderLoan();
		},
		
		renderInitiatives: function(){
			this.$el.find('#manage-initiatives').html(this.tInitiatives({
				career: this.model
			}));		
			
			$('.add-tooltip').tooltip();	
		},
		
		renderResearch: function(){
			this.$el.find('#manage-research').html(this.tResearch({
				career: this.model
			}));			
		},
		
		renderCities: function(){
			this.$el.find('#manage-cities').html(this.tCities({
				career: this.model
			}));				
		},
		
		renderLoan: function(){
			this.loanView.render();
		},
		
		/**
		 * Moves the headquarters, if possible.
		 */
		setHeadquarters: function(event) {
			var cityName = $('#select-choose-headquarters').val();
			ET.cities.setHeadquarters(ET.cities.findWhere({"name": cityName}));
			this.renderCities();
		},		
		
	/**
	 * Researches a clicked power type.
	 */
	researchPlantType : function(event) {
		var plantTypeString = $(event.currentTarget).data('name');
		var plant = ET.Plants[plantTypeString];
		plant = plant.clone();
		this.model.researchPlantType(plant);
	},

	startInitiative : function(event) {
		var typeString = $(event.currentTarget).data('slug');
		var init = ET.Initiatives[typeString];
		init.start();
	},		

	endInitiative : function(event) {
		var typeString = $(event.currentTarget).data('slug');
		var init = ET.Initiatives[typeString];
		init.end();
	},		
	});