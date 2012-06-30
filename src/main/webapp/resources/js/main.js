/* Author:

 */


var TF = {};

TF.onMouseMove = function(e){
    TF.scene.handleInput("MOUSEMOVE",e);
};

TF.onMouseDown = function (e) {
    TF.scene.handleInput("MOUSEDOWN",e);
};

TF.onMouseUp = function (e) {
    TF.scene.handleInput("MOUSEUP",e);
};

TF.clearCanvas = function () {
    TF.ctx.clearRect(0, 0, TF.canvas.width, TF.canvas.height);
};

TF.init = function () {


    TF.debug = {};
    TF.debug.drawBoundingBoxes = true;

    TF.canvas = document.getElementById("mainCanvas");
    TF.canvas.addEventListener("mousedown", TF.onMouseDown, false);
    TF.canvas.addEventListener("mouseup", TF.onMouseUp, false);
    TF.canvas.addEventListener("mousemove", TF.onMouseMove, false);
    TF.ctx = TF.canvas.getContext("2d");


    TF.scene = createScene(TF.canvas.width, TF.canvas.height);


    TF.ctx.strokeStyle = "#ff0000";
    TF.ctx.lineWidth = 2;

    $("#clearButton").click(TF.clearCanvas);


    $(window).keydown(function (ev) {
        var handled = TF.scene.handleInput("KEYDOWN",ev);
        if (handled) {
            return false;
        }
    });
    $(window).keyup(function (ev) {
        var handled = TF.scene.handleInput("KEYUP",ev);
        if (handled) {
            return false;
        }
    });

    TF.animate();
};

window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

TF.animate = function () {

    // update
    TF.scene.update();

//    TF.player.update();
//    TF.map.update();



    //TF.map.checkCollision(TF.player.getTank());

    // clear
    TF.ctx.clearRect(0, 0, TF.canvas.width, TF.canvas.height);

    // draw
    TF.scene.draw(TF.ctx);

    // request new frame
    requestAnimFrame(function () {
        TF.animate();
    });
};


$(document).ready(TF.init());

