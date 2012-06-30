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
	var response = $.getJSON("Content/map/desert2.json");
	$.ajaxSetup({ "async": true });
	var mapdata = $.parseJSON(response.responseText);
	response = null;



	var tileset = createTileSet(mapdata.tilesets);
	var tileLayer = mapdata.layers[0].data;
	that.collisionObjects = createCollisionObjects(mapdata.layers[1].objects);
	var width = mapdata.width;
	var height = mapdata.height;
	var tileHeight = mapdata.tileheight
	var tileWidth = mapdata.tilewidth;


	that.draw = function (ctx, canvasWidth, canvasHeight) {
		drawTiles(ctx, canvasWidth, canvasHeight);
		drawCollisionObjects(ctx);
	};

	var drawTiles = function (ctx, canvasWidth, canvasHeight) {
		var tileToDraw = 0;
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		for (var ypos = 0; ypos < height * tileHeight; ypos += tileHeight) {
			for (var xpos = 0; xpos < width * tileWidth; xpos += tileWidth) {
				//sx, sy, sw, sh, dx, dy, dw, dh
				var tileNr = tileLayer[tileToDraw];
				var tileInfo = tileset.tiles[tileNr];
				ctx.drawImage(tileset.image, tileInfo.xpos, tileInfo.ypos, tileWidth, tileHeight, xpos, ypos, tileWidth, tileHeight);
				tileToDraw++;
			}
		}
		ctx.restore();
	};

	var drawCollisionObjects = function (ctx) {
		for (var i = 0; i < that.collisionObjects.length; i++) {
			that.collisionObjects[i].draw(ctx);
		}
	};

	that.update = function () {

	};

	that.getCollisionObjects = function () {
		return that.collisionObjects;
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

var createCollisionObjects = function (collisionLayerObjects) {
	var objects = [];
	for (var i = 0; i < collisionLayerObjects.length; i++) {
		if (collisionLayerObjects[i].name == "border") {
			var tmpO = createBorderCollisionObject(collisionLayerObjects[i].x , collisionLayerObjects[i].y , collisionLayerObjects[i].width, collisionLayerObjects[i].height);
		} else {
			var tmpO = createCollisionObject(collisionLayerObjects[i].x, collisionLayerObjects[i].y, collisionLayerObjects[i].width, collisionLayerObjects[i].height);
		}
		objects.push(tmpO);
	}
	return objects;


};


var createCollisionObject = function (xpos, ypos, width, height) {

	var that = {};
	var xmin = xpos;
	var xmax = xpos + width;
	var ymin = ypos;
	var ymax = ypos + height;

	//corners
	var c1, c2, c3, c4;

	that.getCorners = function () {
		return [c1, c2, c3, c4];
	}

	that.initCorners = function () {
		c1 = $V([xmin, ymin]);
		c2 = $V([xmin, ymax]);
		c3 = $V([xmax, ymax]);
		c4 = $V([xmax, ymin]);
	};

	that.draw = function (ctx) {
		if (TF.debug.drawBoundingBoxes) {
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.fillStyle = "#8ED6FF";
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#8ED6FF";
			ctx.beginPath();
			ctx.moveTo(c1.elements[0], c1.elements[1]);
			ctx.lineTo(c2.elements[0], c2.elements[1]);
			ctx.lineTo(c3.elements[0], c3.elements[1]);
			ctx.lineTo(c4.elements[0], c4.elements[1]);
			ctx.lineTo(c1.elements[0], c1.elements[1]);
			ctx.stroke();
			ctx.restore();
		}
	};

	that.checkCorner = function (corner) {
		var dist1, dist2, dist3, dist4, line;
		dist1 = pointToLineDistance(c2, c1, corner);

		if (dist1 > 0) {
			line = c1.subtract(c2);
			line = line.toUnitVector();
			return {
				intersect: false,
				dist: dist1,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
		dist2 = pointToLineDistance(c3, c2, corner);
		if (dist2 > 0) {
			line = c2.subtract(c3);
			line = line.toUnitVector();
			return {
				intersect: false,
				dist: dist2,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
		dist3 = pointToLineDistance(c4, c3, corner);

		if (dist3 > 0) {
			line = c3.subtract(c4);
			line = line.toUnitVector();
			return {
				intersect: false,
				dist: dist3,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
		dist4 = pointToLineDistance(c1, c4, corner);
		if (dist4 > 0) {
			line = c4.subtract(c1);
			line = line.toUnitVector();
			return {
				intersect: false,
				dist: dist4,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
		if (dist1 > dist2 && dist1 > dist3 && dist1 > dist4) {
			line = c1.subtract(c2);
			line = line.toUnitVector();
			return {
				intersect: true,
				dist: dist1,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
		if (dist2 > dist1 && dist2 > dist3 && dist2 > dist4) {
			line = c2.subtract(c3);
			line = line.toUnitVector();
			return {
				intersect: true,
				dist: dist2,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
		if (dist3 > dist2 && dist3 > dist1 && dist3 > dist4) {
			line = c3.subtract(c4);
			line = line.toUnitVector();
			return {
				intersect: true,
				dist: dist3,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
		if (dist4 > dist2 && dist4 > dist3 && dist4 > dist1) {
			line = c4.subtract(c1);
			line = line.toUnitVector();
			return {
				intersect: true,
				dist: dist4,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
	};

	that.checkIntersection = function (otherBB) {
		var result, i;
		var otherCorner = otherBB.getCorners();
		var corners = that.getCorners();

		for (i = 0; i < otherCorner.length; i++) {
			result = that.checkCorner(otherCorner[i]);
			if (result.intersect) {
				return result;
			}
		}

		for (i = 0; i < corners.length; i++) {
			result = otherBB.checkCorner(corners[i]);
			if (result.intersect) {
				//reflect normal
				result.normal.elements[0] = -result.normal.elements[0];
				result.normal.elements[1] = -result.normal.elements[1];
				return result;
			}
		}
		return { intersect: false };
	};

	var pointToLineDistance = function (pointA, pointB, pointP) {
		/*
		from wikipedia
		public double pointToLineDistance(Point A, Point B, Point P)
		{
		double normalLength = Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));
		return Math.abs((P.x - A.x) * (B.y - A.y) - (P.y - A.y) * (B.x - A.x)) / normalLength;
		}

		*/

		var aX = pointA.elements[0];
		var aY = pointA.elements[1];
		var bX = pointB.elements[0];
		var bY = pointB.elements[1];
		var pX = pointP.elements[0];
		var pY = pointP.elements[1];


		var normalLength = Math.sqrt((bX - aX) * (bX - aX) + (bY - aY) * (bY - aY));
		var distance = ((pX - aX) * (bY - aY) - (pY - aY) * (bX - aX)) / normalLength;
		return distance;

	};

	that.initCorners();
	return that;
};

var createBorderCollisionObject = function (xpos, ypos, width, height) {

	var that = {};
	var xmin = xpos;
	var xmax = xpos + width;
	var ymin = ypos;
	var ymax = ypos + height;

	//corners
	var c1, c2, c3, c4;

	that.getCorners = function () {
		return [c1, c2, c3, c4];
	}

	that.initCorners = function () {
		c1 = $V([xmin, ymin]);
		c2 = $V([xmin, ymax]);
		c3 = $V([xmax, ymax]);
		c4 = $V([xmax, ymin]);
	};

	that.draw = function (ctx) {
		if (TF.debug.drawBoundingBoxes) {
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.fillStyle = "#8ED6FF";
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#8ED6FF";
			ctx.beginPath();
			ctx.moveTo(c1.elements[0], c1.elements[1]);
			ctx.lineTo(c2.elements[0], c2.elements[1]);
			ctx.lineTo(c3.elements[0], c3.elements[1]);
			ctx.lineTo(c4.elements[0], c4.elements[1]);
			ctx.lineTo(c1.elements[0], c1.elements[1]);
			ctx.stroke();
			ctx.restore();
		}
	};

	that.checkCorner = function (corner) {
		var dist1, dist2, dist3, dist4, line;
		dist1 = pointToLineDistance(c2, c1, corner);

		if (dist1 > 0) {
			line = c1.subtract(c2);
			line = line.toUnitVector();
			return {
				intersect: true,
				dist: dist1,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
		dist2 = pointToLineDistance(c3, c2, corner);
		if (dist2 > 0) {
			line = c2.subtract(c3);
			line = line.toUnitVector();
			return {
				intersect: true,
				dist: dist2,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
		dist3 = pointToLineDistance(c4, c3, corner);

		if (dist3 > 0) {
			line = c3.subtract(c4);
			line = line.toUnitVector();
			return {
				intersect: true,
				dist: dist3,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
		dist4 = pointToLineDistance(c1, c4, corner);
		if (dist4 > 0) {
			line = c4.subtract(c1);
			line = line.toUnitVector();
			return {
				intersect: true,
				dist: dist4,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
		if (dist1 > dist2 && dist1 > dist3 && dist1 > dist4) {
			line = c1.subtract(c2);
			line = line.toUnitVector();
			return {
				intersect: false,
				dist: dist1,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
		if (dist2 > dist1 && dist2 > dist3 && dist2 > dist4) {
			line = c2.subtract(c3);
			line = line.toUnitVector();
			return {
				intersect: false,
				dist: dist2,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
		if (dist3 > dist2 && dist3 > dist1 && dist3 > dist4) {
			line = c3.subtract(c4);
			line = line.toUnitVector();
			return {
				intersect: false,
				dist: dist3,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
		if (dist4 > dist2 && dist4 > dist3 && dist4 > dist1) {
			line = c4.subtract(c1);
			line = line.toUnitVector();
			return {
				intersect: false,
				dist: dist4,
				normal: $V([-line.elements[1], line.elements[0]])
			};
		}
	};

	that.checkIntersection = function (otherBB) {
		var result, i;
		var otherCorner = otherBB.getCorners();
		var corners = that.getCorners();

		for (i = 0; i < otherCorner.length; i++) {
			result = that.checkCorner(otherCorner[i]);
			if (result.intersect) {
				return result;
			}
		}

		for (i = 0; i < corners.length; i++) {
			result = otherBB.checkCorner(corners[i]);
			if (result.intersect) {
				//reflect normal
				result.normal.elements[0] = -result.normal.elements[0];
				result.normal.elements[1] = -result.normal.elements[1];
				return result;
			}
		}
		return { intersect: false };
	};

	var pointToLineDistance = function (pointA, pointB, pointP) {
		/*
		from wikipedia
		public double pointToLineDistance(Point A, Point B, Point P)
		{
		double normalLength = Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));
		return Math.abs((P.x - A.x) * (B.y - A.y) - (P.y - A.y) * (B.x - A.x)) / normalLength;
		}

		*/

		var aX = pointA.elements[0];
		var aY = pointA.elements[1];
		var bX = pointB.elements[0];
		var bY = pointB.elements[1];
		var pX = pointP.elements[0];
		var pY = pointP.elements[1];


		var normalLength = Math.sqrt((bX - aX) * (bX - aX) + (bY - aY) * (bY - aY));
		var distance = ((pX - aX) * (bY - aY) - (pY - aY) * (bX - aX)) / normalLength;
		return distance;

	};

	that.initCorners();
	return that;
};