"use strict";

var mask = {
    _isMouseDown: false,
    _isInCanvas: false,
    _x: 0,
    _y: 0,
    _originMouseCursor: null,
    _backgroudCanvasData: null,
    defaultRadius: Number.parseInt($(window).width() / 12),

    setup() {
        $("#container").css("cursor", "auto");
    },

    mousedown(e) {
        this._originMouseCursor = $("#container").css("cursor");
        $("#container").css("cursor", "grabbing");
        this._isMouseDown = true;
        this._isInCanvas = true;
        this._x = e.offsetX;
        this._y = e.offsetY;
        this._redrawBackground();
        this._drawCircleMask(e);
    },

    mouseup(e) {
        this._isMouseDown = false;
        $("#container").css("cursor", this._originMouseCursor);
    },

    mouseover(e) {
        this._isInCanvas = true;
        // 偵測游標進入 canvas 時，滑鼠左鍵是否按著
        if (e.buttons === 1) {
            this._isMouseDown = true;
        }
        if (this._isMouseDown) {
            $("#container").css("cursor", "grabbing");
        }
    },

    mouseout(e) {
        this._isInCanvas = false;
        this._isMouseDown = false;
        $("#container").css("cursor", this._originMouseCursor);
    },

    mousemove(e) {
        $("#container").css("cursor", "grab");
        if (this._isMouseDown == true && this._isInCanvas == true) {
            canvasNav.clearCanvas(false);
            this._redrawBackground();
            this._drawCircleMask(e);
        }
    },

    _redrawBackground() {
        canvasNav.clearCanvas(false);
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = `rgba(30, 30, 30, ${$("#mask_transparency").val()})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    },

    _drawCircleMask(e) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "#000000"; // 設定為不透明色，組合圖片可以正確透明
        let radius = $("#mask_radius").val();
        ctx.beginPath();
        ctx.ellipse(e.offsetX, e.offsetY, radius, radius, 0, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
    },
};
