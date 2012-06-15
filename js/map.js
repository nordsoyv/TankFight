/**
 * Created with JetBrains WebStorm.
 * User: Oyvind
 * Date: 13.06.12
 * Time: 00:13
 * To change this template use File | Settings | File Templates.
 */


var createHouse = function (spec) {
    var that = {};


    that.xpos = spec.xpos;
    that.ypos = spec.ypos;
    that.width = spec.width;
    that.height = spec.height;
    that.roofImg = new Image();
    that.roofImg.src = "img/roof.png";

    that.draw = function (ctx) {
        ctx.save();
        ctx.translate(that.xpos,that.ypos);
        ctx.rotate(4);
        ctx.drawImage(that.roofImg, -that.width/2 , -that.height/2, that.width, that.height);
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
        width: 128,
        height:256
    };
    var house = createHouse(houseSpec);
    this.update = function () {

    };


    this.draw = function (ctx, sx, sy) {
        drawGround(ctx, sy, sx);
        house.draw(ctx);
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