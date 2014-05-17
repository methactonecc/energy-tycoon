ET.LoanView = Backbone.View.extend({
	/*
	 Manages interactions with the user's loan.
	 
	 Model: ET.Loan
	 */
	el : $('#manage-loan'),
	
	events: {	
		"click #btn-loan-borrow": 	"borrow",
		"click #btn-loan-repay": 	"repay",
		"click #btn-loan-repay-full": "repayFull"	
	},

	//Template functions to use
	myTemplate : template("template-loan"),

	initialize : function() {
		//create throttled versions of commonly-called fns
		this.render = _.throttle(this._render, 50);		
		
		//Bind to relevant events here
		this.listenTo(this.model, "change:balance", this.render);
		this.listenTo(ET.career, "change:money", this.render);
		
		this.render();
	},

	_render : function() {
		this.$el.html(this.myTemplate({
			loan: this.model
		}));
	},
	
	borrow: function(){
		var amount = constrain(parseInt($('#input-loan-borrow').val()), 0, this.model.getMaxBorrow());
		this.model.borrow(amount);
	},

	repay: function(){
		var amount = constrain(parseInt($('#input-loan-repay').val()), 0, this.model.getMaxRepayment());
		this.model.repay(amount);
	},
	
	repayFull: function(){
		this.model.repay(this.model.getMaxRepayment());
	},
	
});