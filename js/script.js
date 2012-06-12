/* Author:

 */


var CT = {};

CT.onMouseMove = function(e){
    CT.player.handleInput("MOUSEMOVE",e);
};

CT.onMouseDown = function (e) {
    CT.player.handleInput("MOUSEDOWN",e);
};

CT.onMouseUp = function (e) {
    CT.player.handleInput("MOUSEUP",e);
};

CT.clearCanvas = function () {
    CT.ctx.clearRect(0, 0, CT.canvas.width, CT.canvas.height);
};

CT.init = function () {
    CT.player = new Player("default");
    CT.canvas = document.getElementById("mainCanvas");
    CT.canvas.addEventListener("mousedown", CT.onMouseDown, false);
    CT.canvas.addEventListener("mouseup", CT.onMouseUp, false);
    CT.canvas.addEventListener("mousemove", CT.onMouseMove, false);
    CT.ctx = CT.canvas.getContext("2d");

    CT.ctx.strokeStyle = "#ff0000";
    CT.ctx.lineWidth = 2;

    $("#clearButton").click(CT.clearCanvas);


    $(window).keydown(function (ev) {
        var handled = CT.player.handleInput("KEYDOWN",ev);
        if (handled) {
            return false;
        }
    });
    $(window).keyup(function (ev) {
        var handled = CT.player.handleInput("KEYUP",ev);
        if (handled) {
            return false;
        }
    });

    CT.animate();
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

CT.animate = function () {

    // update


    CT.player.update();

    // clear
    CT.ctx.clearRect(0, 0, CT.canvas.width, CT.canvas.height);

    // draw
    CT.player.draw(CT.ctx);
    // request new frame
    requestAnimFrame(function () {
        CT.animate();
    });
};


$(document).ready(CT.init());

