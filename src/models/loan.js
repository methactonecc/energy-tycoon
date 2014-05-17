ET.Loan = Backbone.Model.extend({
	/**
	 * A loan, representing a sum of money borrowed from the bank.
	 * This is a Singleton since there can only be one loan (just different levels of borrowing.)
	 * 
	 * Constants:
	 * int borrowingCap		max amount you can have borrowed. Your debt can go above this b/c of interest, but you can't borrow any more than this.
	 * float interestRate	.05 => 5% interest (simple interest)
	 * 
	 * Variables:
	 * int balance			The amount owed. When you borrow $x, $x(1+interestRate) is added to this.
	 * 
	 * Functions:
	 * void repay(int amount)	Reduces the balance by the given amount and subtracts from the account balance.
	 * void borrow(int amount)	Increases the size of the loan by the given amount.
	 * int getMaxRepayment()	Returns how much the user can repay.
	 * int getMaxBorrow() 		Returns how much the user can borrow.
	 *
	 */

	defaults : {
		borrowingCap:	200000,
		interestRate:	0.05,
		
		balance: 0
	},
	
	/**
	 * Returns how much the user can afford to repay.
	 */
	getMaxRepayment: function(){
		var userHas = ET.career.get('money');
		return Math.min(userHas, this.get('balance'));
	},
	
	/**
	 * Returns how much the user can legally borrow without going over the limit: an int if possible, or 0 if they've hit the cap
	 */
	getMaxBorrow: function(){
		//if they owe more than the borrowing cap (can happen - imagine if you borrow $200k off the bat when the cap is $200k and have $210k in debt), return 0 anyway
		return Math.max(this.get('borrowingCap') - this.get('balance'), 0);
	},
	
	/**
	 * Attempts to repay a certain amount of the outstanding debt. You DON'T need to check if they're trying to repay too much, but for interface reasons you probably should.
	 */
	repay: function(amount){
		amount = Math.min(amount, this.getMaxRepayment()); //correct it in case they didn't
		ET.career.spendMoney(amount);
		this.set('balance', this.get('balance') - amount);
	},
	
	/**
	 * Attempts to borrow a certain amount of money. You DON'T need to check if they're trying to borrow too much, but for interface reasons you probably should.
	 */
	borrow: function(amount){
		var maxBorrow = this.getMaxBorrow();
		if(maxBorrow == 0){ return false; }
		
		amount = Math.min(amount, this.getMaxBorrow()); //correct it in case they didn't
		ET.career.gainMoney(amount);
		var increase = Math.round(amount * (1 + this.get('interestRate')));
		this.set('balance', this.get('balance') + increase);
	}		
});
