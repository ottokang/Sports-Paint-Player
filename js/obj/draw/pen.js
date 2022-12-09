"use strict";

var pen = {
    _isMouseDown: false,
    _isInCanvas: false,
    _x: 0,
    _y: 0,
    _originMouseCursor: null,
    _arrowRecordCountDown: 5,
    _arrowFromX: null,
    _arrowFromY: null,
    colors: {
        紅色: "#f542a7",
        黃色: "#e8c62e",
        藍色: "#0033cc",
    },

    reset() {
        this._isMouseDown = false;
        this._isInCanvas = false;
        ctx.setLineDash([]);
    },

    setup() {
        // 設定畫布滑鼠指標、畫筆顏色、屬性
        $("#container").css("cursor", "auto");
        ctx.strokeStyle = $("#pen_color").val();
        ctx.fillStyle = $("#pen_color").val();
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = $("#pen_width").val();
    },

    mousedown(e) {
        this.setup();
        this._originMouseCursor = $("#container").css("cursor");
        $("#container").css("cursor", "pointer");
        this._isMouseDown = true;
        this._isInCanvas = true;
        this._x = e.offsetX;
        this._y = e.offsetY;
        this._draw(e);
    },

    mouseup(e) {
        this._isMouseDown = false;
        $("#container").css("cursor", this._originMouseCursor);
        this._arrowRecordCountDown = 5;
        if ($("#is_arrow").prop("checked") === true) {
            this._drawArrow(this._arrowFromX, this._arrowFromY, e.offsetX, e.offsetY, $("#pen_width").val() * 2.5);
        }
    },

    mouseover(e) {
        this._isInCanvas = true;
        // 偵測游標進入 canvas 時，滑鼠左鍵是否按著
        if (e.buttons === 1) {
            this._isMouseDown = true;
        }
        this._x = e.offsetX;
        this._y = e.offsetY;
        if (this._isMouseDown) {
            $("#container").css("cursor", "pointer");
        }
    },

    mouseout(e) {
        this._isInCanvas = false;
        this._isMouseDown = false;
        $("#container").css("cursor", this._originMouseCursor);
    },

    mousemove(e) {
        if (this._isMouseDown === true && this._isInCanvas === true) {
            this._arrowRecordCountDown--;
            if (this._arrowRecordCountDown === 0) {
                this._arrowFromX = e.offsetX;
                this._arrowFromY = e.offsetY;
                this._arrowRecordCountDown = 5;
            }
            this._draw(e);
        }
    },

    _draw(e) {
        ctx.beginPath();
        ctx.moveTo(this._x, this._y);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        this._x = e.offsetX;
        this._y = e.offsetY;
    },

    _drawArrow(fromX, fromY, toX, toY, radius) {
        let x_center = toX;
        let y_center = toY;
        let angle, x, y;

        ctx.beginPath();

        angle = Math.atan2(toY - fromY, toX - fromX);
        x = radius * Math.cos(angle) + x_center;
        y = radius * Math.sin(angle) + y_center;
        ctx.moveTo(x, y);

        angle += (1.0 / 3.0) * (2 * Math.PI);
        x = radius * Math.cos(angle) + x_center;
        y = radius * Math.sin(angle) + y_center;
        ctx.lineTo(x, y);

        angle += (1.0 / 3.0) * (2 * Math.PI);
        x = radius * Math.cos(angle) + x_center;
        y = radius * Math.sin(angle) + y_center;
        ctx.lineTo(x, y);

        ctx.closePath();
        ctx.fill();
    },
};
