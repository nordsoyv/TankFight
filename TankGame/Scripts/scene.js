/// <reference path="map.js" />
/// <reference path="tiledMap.js" />

var createScene = function (canvasWidth, canvasHeight) {
	var that = {};
	that.tiledMap = createTiledMap();
	that.player = new Player("Name");



	that.update = function () {
		that.tiledMap.update();
		that.player.update();

		that.player.checkCollision(that.tiledMap.getCollisionObjects());


	};

	that.draw = function (ctx) {
		that.tiledMap.draw(ctx, canvasWidth, canvasHeight);
		that.player.draw(ctx);

	};

	that.handleInput = function (type, event) {
		return that.player.handleInput(type, event);
	};


	return that;
};