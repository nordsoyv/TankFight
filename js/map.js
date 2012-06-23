/**
 * Created with JetBrains WebStorm.
 * User: Oyvind
 * Date: 13.06.12
 * Time: 00:13
 * To change this template use File | Settings | File Templates.
 */

var degToRad = function(angle){
    return (angle / 360) * 2 * Math.PI;
};

var createMoveableBoudingBox = function (spec) {

    var that = {};
    var xmin = -spec.width / 2;
    var xmax = spec.width / 2;
    var ymin = -spec.height / 2;
    var ymax = spec.height / 2;



    //create corners
    var c1, c2, c3, c4;
    initCorners();
    rotateCorners(spec.angle);
    moveCorners(spec.xpos,spec.ypos);

    function initCorners() {
        c1 = $V([xmin, ymin  ]);
        c2 = $V([xmin, ymax  ]);
        c3 = $V([xmax, ymax  ]);
        c4 = $V([xmax, ymin  ]);
    }

    function rotateCorners (angle){
        var axis = $V([0, 0  ]);
        c1 = c1.rotate(angle, axis);
        c2 = c2.rotate(angle, axis);
        c3 = c3.rotate(angle, axis);
        c4 = c4.rotate(angle, axis);
    }

    function moveCorners(xpos,ypos){
        var pos = $V([xpos, ypos  ]);
        c1 = c1.add(pos);
        c2 = c2.add(pos);
        c3 = c3.add(pos);
        c4 = c4.add(pos);
    }

    that.update = function (newX, newY, angle) {
        initCorners();
        rotateCorners(angle);
        moveCorners(newX,newY);
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


    return that;

};

var createStaticBoundingBox = function (spec) {

    var that = {};
    var xmin = -spec.width / 2;
    var xmax = spec.width / 2;
    var ymin = -spec.height / 2;
    var ymax = spec.height / 2;
    var rotateAngle = spec.angle;

    var pos = $V([spec.xpos, spec.ypos  ]);
    //create corners
    var c1 = $V([xmin, ymin  ]);
    var c2 = $V([xmin, ymax  ]);
    var c3 = $V([xmax, ymax  ]);
    var c4 = $V([xmax, ymin  ]);
    //rotate corners
    var axis = $V([0, 0  ]);
    c1 = c1.rotate(rotateAngle, axis);
    c2 = c2.rotate(rotateAngle, axis);
    c3 = c3.rotate(rotateAngle, axis);
    c4 = c4.rotate(rotateAngle, axis);
    //move to correct pos
    c1 = c1.add(pos);
    c2 = c2.add(pos);
    c3 = c3.add(pos);
    c4 = c4.add(pos);


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
    mapObjects.push(createHouse(houseSpec));
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