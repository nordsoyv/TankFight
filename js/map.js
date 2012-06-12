/**
 * Created with JetBrains WebStorm.
 * User: Oyvind
 * Date: 13.06.12
 * Time: 00:13
 * To change this template use File | Settings | File Templates.
 */


var Map = function(){

    var mapObjects =  [];

    var groundImg = new Image();
    groundImg.src = "img/tarmac_128.jpg";


    this.update = function(){

    };

    this.draw = function(ctx,sx,sy){
        drawGround(ctx,sy,sx);
    };

    var drawGround = function(ctx, sx,sy){
        var xpos= 0;
        var ypos =0;
        for(xpos =0 ; xpos < sx; xpos +=128 ){
            for(ypos = 0;ypos < sy; ypos +=128  ){
                ctx.drawImage(groundImg,xpos,ypos);
            }
        }

    }

    return this;

};