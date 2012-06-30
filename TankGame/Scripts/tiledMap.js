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



	var tileset = createTileSet(mapdata.tilesets);
	var tileLayer = mapdata.layers[0].data;
	var width = mapdata.widht;
	var height = mapdata.height;
	var tileHeight = mapdata.tileheight
	var tileWidth = mapdata.tilewidth;


	that.draw = function (ctx, canvasWidth, canvasHeight) {
		var tileToDraw = 0;
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		for (ypos = 0; ypos < canvasHeight || ypos < height * tileHeight; ypos += tileHeight) {
			for (xpos = 0; xpos < canvasWidth || xpos < width * tileWidth; xpos += tileWidth) {
				//sx, sy, sw, sh, dx, dy, dw, dh
				var tileNr = tileLayer[tileToDraw];
				var tileInfo = tileset.tiles[tileNr];
				ctx.drawImage(tileset.image, tileInfo.xpos, tileInfo.ypos, tileWidth, tileHeight, xpos, ypos, tileWidth, tileHeight);
				tileToDraw++;
			}
		}



		ctx.restore();
	};

	that.update = function () {

	};

	return that;
};

var createTileSet = function (tileset) {
	var that = {};
	that.margin = tileset[0].margin;
	that.spacing = tileset[0].spacing;
	that.firstgid = tileset[0].firstgid;
	that.image = tileset[0].image;
	that.imageheight = tileset[0].imageheight;
	that.imagewidth = tileset[0].imagewidth;
	that.tileheight = tileset[0].tileheight;
	that.tilewidth = tileset[0].tilewidth;
	that.image = new Image();
	that.image.src = tileset[0].image;
	that.tiles = [];
	var tileCounter = that.firstgid;

	for (var ypos = that.margin; ypos < that.imageheight; ) {

		for (var xpos = that.margin; xpos < that.imagewidth - that.margin; ) {
			var tile = {};
			tile.xpos = xpos;
			tile.ypos = ypos;
			that.tiles[tileCounter] = tile;
			tileCounter++;
			xpos += that.spacing + that.tilewidth;
		}
		ypos += that.spacing + that.tileheight;
	}


	return that;

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