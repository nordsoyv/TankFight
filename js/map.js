/**
 * Created with JetBrains WebStorm.
 * User: Oyvind
 * Date: 13.06.12
 * Time: 00:13
 * To change this template use File | Settings | File Templates.
 */

var degToRad = function (angle) {
    return (angle / 360) * 2 * Math.PI;
};


var createMoveableBoundingBox = function (spec) {

    var that = createStaticBoundingBox(spec);

    that.update = function (newX, newY, angle) {
        that.initCorners();
        that.rotateCorners(angle);
        that.moveCorners(newX, newY);
    };

    return that;

};

var createStaticBoundingBox = function (spec) {

    var that = {};
    var xmin = -spec.width / 2;
    var xmax = spec.width / 2;
    var ymin = -spec.height / 2;
    var ymax = spec.height / 2;

    //corners
    var c1, c2, c3, c4;

    that.getCorners = function () {
        return [c1, c2, c3, c4];
    }

    that.initCorners = function () {
        c1 = $V([xmin, ymin  ]);
        c2 = $V([xmin, ymax  ]);
        c3 = $V([xmax, ymax  ]);
        c4 = $V([xmax, ymin  ]);
    };

    that.rotateCorners = function (angle) {
        var axis = $V([0, 0  ]);
        c1 = c1.rotate(angle, axis);
        c2 = c2.rotate(angle, axis);
        c3 = c3.rotate(angle, axis);
        c4 = c4.rotate(angle, axis);
    }

    that.moveCorners = function (xpos, ypos) {
        var pos = $V([xpos, ypos  ]);
        c1 = c1.add(pos);
        c2 = c2.add(pos);
        c3 = c3.add(pos);
        c4 = c4.add(pos);
    }

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
        var dist1,dist2,dist3,dist4,line;
        dist1 = pointToLineDistance(c2, c1, corner);

        if (dist1 > 0) {
            line = c1.subtract(c2);
            line = line.toUnitVector();
            return {
                intersect:false,
                dist:dist1,
                normal:$V([ -line.elements[1] , line.elements[0]])
            };
        }
        dist2 = pointToLineDistance(c3, c2, corner);
        if (dist2 > 0) {
            line = c2.subtract(c3);
            line = line.toUnitVector();
            return {
                intersect:false,
                dist:dist2,
                normal:$V([ -line.elements[1] , line.elements[0]])
            };
        }
        dist3 = pointToLineDistance(c4, c3, corner);

        if (dist3 > 0) {
            line = c3.subtract(c4);
            line = line.toUnitVector();
            return {
                intersect:false,
                dist:dist3,
                normal:$V([ -line.elements[1] , line.elements[0]])
            };
        }
        dist4 = pointToLineDistance(c1, c4, corner);
        if (dist4 > 0) {
            line = c4.subtract(c1);
            line = line.toUnitVector();
            return {
                intersect:false,
                dist:dist4,
                normal:$V([ -line.elements[1] , line.elements[0]])
            };
        }
        if (dist1 > dist2 && dist1 > dist3 && dist1 > dist4) {
            line = c1.subtract(c2);
            line = line.toUnitVector();
            return {
                intersect:true,
                dist:dist1,
                normal:$V([ -line.elements[1] , line.elements[0]])
            };
        }
        if (dist2 > dist1 && dist2 > dist3 && dist2 > dist4) {
            line = c2.subtract(c3);
            line = line.toUnitVector();
            return {
                intersect:true,
                dist:dist2,
                normal:$V([ -line.elements[1] , line.elements[0]])
            };
        }
        if (dist3 > dist2 && dist3 > dist1 && dist3 > dist4) {
            line = c3.subtract(c4);
            line = line.toUnitVector();
            return {
                intersect:true,
                dist:dist3,
                normal:$V([ -line.elements[1] , line.elements[0]])
            };
        }
        if (dist4 > dist2 && dist4 > dist3 && dist4 > dist1) {
            line = c4.subtract(c1);
            line = line.toUnitVector();
            return {
                intersect:true,
                dist:dist4,
                normal:$V([ -line.elements[1] , line.elements[0]])
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
        return {intersect:false};
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


        var normalLength = Math.sqrt(( bX - aX  ) * ( bX - aX) + (bY - aY) * (bY - aY));
        var distance = (  (pX - aX) * (bY - aY) - (pY - aY) * (bX - aX)) / normalLength;
        return distance;

    };

    that.initCorners();
    that.rotateCorners(spec.angle);
    that.moveCorners(spec.xpos, spec.ypos);
    return that;
};

var createHouse = function (spec) {
    spec.img = "img/roof.png";
    return createMapObject(spec);
};

var createMapObject = function (spec) {
    var that = {};

    that.xpos = spec.xpos;
    that.ypos = spec.ypos;
    that.width = spec.width;
    that.height = spec.height;
    that.rotAngle = spec.angle;
    that.img = new Image();
    that.img.src = spec.img;

    if (spec.collision) {
        that.boundingBox = createStaticBoundingBox(spec);
    }

    that.draw = function (ctx) {
        ctx.save();
        ctx.translate(that.xpos, that.ypos);
        ctx.rotate(that.rotAngle);
        ctx.drawImage(that.img, -that.width / 2, -that.height / 2, that.width, that.height);
        that.boundingBox.draw(ctx);
        ctx.restore();
    };

    return that;

};


var Map = function () {

    var mapObjects = [];
    var collisionObjects = [];
    var groundImg = new Image();
    groundImg.src = "img/tarmac_128.jpg";
    var houseSpec = {
        xpos:450,
        ypos:150,
        angle:degToRad(60),
        collision:true,
        width:128,
        height:256
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
    }

    return this;

};