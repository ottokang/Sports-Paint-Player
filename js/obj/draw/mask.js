"use strict";

var mask = {
    _backgroudCanvasData: null,
    _defaultRadius: Number.parseInt($(window).width() / 12),
    _isInCanvas: false,
    _isMouseDown: false,
    _originMouseCursor: null,
    _x: 0,
    _y: 0,

    // 初始物件設定
    init() {
        // 設定預設遮罩大小
        $("#mask_radius").val(this._defaultRadius);
    },

    // 切換物件後設定物件選項
    setup() {
        $("#canvas_area").css("cursor", "grab");
    },

    mousedown(e) {
        this._originMouseCursor = $("#canvas_area").css("cursor");
        $("#canvas_area").css("cursor", "grabbing");
        this._isMouseDown = true;
        this._isInCanvas = true;
        this._x = e.offsetX;
        this._y = e.offsetY;
        this._redrawBackground();
        this._drawCircleMask(e);
    },

    mouseup(e) {
        this._isMouseDown = false;
        $("#canvas_area").css("cursor", this._originMouseCursor);
    },

    mouseover(e) {
        this._isInCanvas = true;
        // 偵測游標進入 canvas 時，滑鼠左鍵是否按著
        if (e.buttons === 1) {
            this._isMouseDown = true;
        }

        if (this._isMouseDown) {
            $("#canvas_area").css("cursor", "grabbing");
        }
    },

    mouseout(e) {
        this._isInCanvas = false;
        this._isMouseDown = false;
        $("#canvas_area").css("cursor", this._originMouseCursor);
    },

    mousemove(e) {
        $("#canvas_area").css("cursor", "grab");
        if (this._isMouseDown == true && this._isInCanvas == true) {
            $("#canvas_area").css("cursor", "grabbing");
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
