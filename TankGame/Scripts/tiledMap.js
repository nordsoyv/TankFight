/// <reference path="libs/jquery-1.7.1.js" />
/**
* Created with JetBrains WebStorm. User: Oyvind Date: 13.06.12 Time: 00:13 To
* change this template use File | Settings | File Templates.
*/


var degToRad = function (angle) {
	return (angle / 360) * 2 * Math.PI;
};

var createTiledMap = function () {
	var that = {};
	that.collisionObjects = [];





	$.ajaxSetup({ "async": false });
	var response = $.getJSON("Content/map/desert.json");
	$.ajaxSetup({ "async": true });
	var mapdata = $.parseJSON(response.responseText);
	response = null;

	



	return that;
};

var createTileSet = function (tileset) {

};
/*
var Map = function () {

	var mapObjects = [];
	var collisionObjects = [];
	var groundImg = new Image();
	groundImg.src = "Content/img/tarmac_128.jpg";
	var houseSpec = {
		xpos: 450,
		ypos: 150,
		angle: degToRad(60),
		collision: true,
		width: 128,
		height: 256
	};

	var house = createHouse(houseSpec);
	mapObjects.push(house);
	collisionObjects.push(house);

	this.getCollisionObjects = function () {
		return collisionObjects;
	};

	this.update = function () {

	};

	this.draw = function (ctx, sx, sy) {
		drawGround(ctx, sy, sx);
		for (var i = 0; i < mapObjects.length; i++) {
			mapObjects[i].draw(ctx);
		}
	};

	var drawGround = function (ctx, sx, sy) {
		var xpos = 0;
		var ypos = 0;
		for (xpos = 0; xpos < sx; xpos += 128) {
			for (ypos = 0; ypos < sy; ypos += 128) {
				ctx.drawImage(groundImg, xpos, ypos);
			}
		}
	};

	return this;

};

*/