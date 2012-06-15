/**
 * Created with JetBrains WebStorm.
 * User: Oyvind
 * Date: 07.06.12
 * Time: 22:42
 * To change this template use File | Settings | File Templates.
 */

var defaultTank = {
    barrelColor:"0A0044",
    movementRate:80,
    rotateAnglePerSecond:45,
    traversAnglePerSecond:39,
    bodyLength:120, //same as image
    bodyWidth:60,
    bodyImage:"img/defaultBody.png",
    turretLength:75, // same as image
    turretWidth:60,
    turretImage:"img/defaultTurret.png",
    barrelCaliber:7,
    barrelLength:15,
    frontArmor : 100,
    backArmor : 50,
    sideArmor : 70
};

var Tank = function (spec) {
    var barrelColor = spec.barrelColor;
    var rotateAPS = spec.rotateAnglePerSecond;
    var traversAPS = spec.traversAnglePerSecond;
    var bodyLength = spec.bodyLength;
    var bodyWidth = spec.bodyWidth;
    var turretLength = spec.turretLength;
    var turretWidth = spec.turretWidth;
    var barrelCaliber = spec.barrelCaliber;
    var barrelLength = spec.barrelLength * barrelCaliber;
    var movementRate = spec.movementRate;
    var barrelWidth = barrelCaliber;

    var bodyImage = new Image();
    bodyImage.src = spec.bodyImage;

    var turretImage = new Image();
    turretImage.src = spec.turretImage;

    var rotateSpeed = (( (Math.PI * 2) / 360) * rotateAPS ) / 60;
    var traverseSpeed = (( (Math.PI * 2) / 360) * traversAPS ) / 60;
    var movementSpeed = movementRate / 60;

    var downVector = $V([0, -1]);
    var aimVector = $V([0, 1]);

    var bodyAngle = 0;
    var turretAngle = 0;

    var moveX = 0, moveY = 0;

    var posX = 300, posY = 300;
    var aimX = 0, aimY = 0;

    this.update = function () {
        moveBody();
        rotateBody();
        rotateTurret();
    };

    this.draw = function (ctx) {
        ctx.save();
        drawBody(ctx);
        drawTurret(ctx);
        drawCrossHair(ctx);
        ctx.restore();
    };

    this.rotateLeft = function () {
        moveX = -1;
    };
    this.rotateRight = function () {
        moveX = 1;
    };

    this.rotateStop = function () {
        moveX = 0;
    };

    this.moveForward = function () {
        moveY = 1;
    };
    this.moveBack = function () {
        moveY = -1;
    };
    this.moveStop = function () {
        moveY = 0;
    };
    this.aimAt = function (x, y) {
        aimX = x;
        aimY = y;

    };

    var moveBody = function () {
        if (moveY != 0) {
            var bodyVector = $V([0, -1]);
            var zeroVec = $V([0, 0]);
            bodyVector = bodyVector.rotate(bodyAngle, zeroVec);
            bodyVector = bodyVector.toUnitVector();
            posX += moveY * bodyVector.elements[0] * movementSpeed;
            posY += moveY * bodyVector.elements[1] * movementSpeed;

        }
    };

    var rotateBody = function () {
        bodyAngle += moveX * rotateSpeed;
        if (bodyAngle > Math.PI * 2) {
            bodyAngle -= Math.PI * 2;
        }
        if (bodyAngle < 0) {
            bodyAngle += Math.PI * 2;
        }

        //move turret along with body
        turretAngle += moveX * rotateSpeed;
        if (turretAngle > Math.PI * 2) {
            turretAngle -= Math.PI * 2;
        }
        if (turretAngle < 0) {
            turretAngle += Math.PI * 2;
        }
    };

    var rotateTurret = function () {

        aimVector = $V([aimX - posX, aimY - posY  ]);
        var angle = aimVector.angleFrom(downVector);


        if (aimVector.elements[0] < 0) {
            angle = (2 * Math.PI) - angle;
        }
    //    angle += Math.PI;
        if (angle > 2 * Math.PI) {
            angle -= 2 * Math.PI;
        }

        var rotAmount = turretAngle - angle;
        if (rotAmount > Math.PI) {
            angle += Math.PI * 2;
        }
        if (rotAmount < -Math.PI) {
            angle -= Math.PI * 2;
        }

      //  $("#output").val(rotAmount);

        if (turretAngle < angle) {
            if (turretAngle + traverseSpeed < angle) {
                turretAngle += traverseSpeed;
            } else {
                turretAngle = angle;
            }
        } else {
            if (turretAngle - traverseSpeed > angle) {
                turretAngle -= traverseSpeed;
            } else {
                turretAngle = angle;
            }
        }
        //turretAngle += moveY * traverseSpeed;
        if (turretAngle > Math.PI * 2) {
            turretAngle -= Math.PI * 2;
        }
        if (turretAngle < 0) {
            turretAngle += Math.PI * 2;
        }


    };


    var drawTurret = function (ctx) {
        ctx.save();
        ctx.translate(posX, posY);
        ctx.rotate(turretAngle);
        ctx.fillStyle = barrelColor;

        ctx.fillRect(-barrelWidth / 2, 0, barrelWidth, -barrelLength);
        ctx.drawImage(turretImage, -turretWidth / 2, -turretLength / 2);
        ctx.restore();

    };

    var drawBody = function (ctx) {
        ctx.save();
        ctx.translate(posX, posY);
        ctx.rotate(bodyAngle);
        ctx.drawImage(bodyImage, -bodyWidth / 2, -bodyLength / 2);
        ctx.restore();
    };

    var drawCrossHair = function (ctx) {
        ctx.save();
        ctx.translate(aimX, aimY);
        ctx.strokeStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(-10, -10, 10, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };


    return this;

};


var Player = function (playerName) {

    var name = playerName;

    var tank = new Tank(defaultTank);
    var isShooting = false;

    this.update = function () {
        tank.update();
    };


    this.draw = function (ctx) {
        ctx.save();
        tank.draw(ctx);
        ctx.restore();
    };


    this.handleInput = function (type, event) {
        switch (type) {
            case "MOUSEMOVE":
                handleMouseMove(event);
                break;
            case "MOUSEDOWN":
                handleMouseDown(event);
                break;
            case "MOUSEUP":
                handleMouseUp(event);
                break;
            case "KEYUP":
                return handleUpInput(event);
                break;
            case "KEYDOWN":
                return handleDownInput(event);
                break;
        }
    };

    var handleMouseDown = function (e) {
        isShooting = true;
    };

    var handleMouseUp = function (e) {
        isShooting = false;
    };

    var handleMouseMove = function (e) {
        tank.aimAt(e.x, e.y);
    };


    var handleDownInput = function (ev) {
        if (ev.which == $.ui.keyCode.UP || ev.which == 87) {
            tank.moveForward();
            return true;
        } else if (ev.which == $.ui.keyCode.DOWN || ev.which == 83) {
            tank.moveBack();
            return true;
        } else if (ev.which == $.ui.keyCode.LEFT || ev.which == 65) {
            tank.rotateLeft();
            return true;
        } else if (ev.which == $.ui.keyCode.RIGHT || ev.which == 68) {
            tank.rotateRight();
            return true;
        }
        return false;
    };

    var handleUpInput = function (ev) {
        if (ev.which == $.ui.keyCode.UP || ev.which == 87) {
            tank.moveStop();
            return true;
        } else if (ev.which == $.ui.keyCode.DOWN || ev.which == 83) {
            tank.moveStop();
            return true;
        } else if (ev.which == $.ui.keyCode.LEFT || ev.which == 65) {
            tank.rotateStop();
            return true;
        } else if (ev.which == $.ui.keyCode.RIGHT || ev.which == 68) {
            tank.rotateStop();
            return true;
        }
        return false;
    }

};

