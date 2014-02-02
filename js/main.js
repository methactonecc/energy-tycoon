$(document).ready(function(){
	

	Game = {
		// Initialize and start our game
		start : function() {
			Crafty.init(500,350, $('#game-container').get()[0]);
			Crafty.background('green');
		}
	}
	
	Game.start();

	
      //Crafty.init();
      Crafty.e('2D, DOM, Color').attr({x: 0, y: 0, w: 100, h: 100}).color('#F00');	
});
