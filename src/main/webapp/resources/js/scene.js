var createScene = function (canvasWidth, canvasHeight) {
    var that = {};
    that.map = new Map();
    that.tiledMap = createTiledMap();
    that.player = new Player("Name");

    
    
    that.update = function () {
        that.map.update();
        that.player.update();

        that.player.checkCollision(that.map.getCollisionObjects());


    };

    that.draw = function (ctx) {
        that.map.draw(ctx,canvasWidth,canvasHeight);
        that.player.draw(ctx);

    };

    that.handleInput = function(type, event){
        return that.player.handleInput(type,event);
    };


    return that;
};