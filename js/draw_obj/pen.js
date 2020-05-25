"use strict"

var pen = {
    _isMouseDown: false,
    _isInCanvas: false,
    _x: 0,
    _y: 0,
    _originMouseCursor: null,
    colors: {
        "紅色": "#f542a7",
        "黃色": "#e8c62e",
        "藍色": "#0033cc"
    },

    setup() {
        // 設定畫布滑鼠指標、畫筆顏色、屬性
        $("#container").css("cursor", "auto")
        ctx.strokeStyle = $("#pen_color").val()
        ctx.lineJoin = "round"
        ctx.lineCap = "round"
        ctx.lineWidth = 5
        return this
    },

    mousedown(e) {
        this._originMouseCursor = $("#container").css("cursor")
        $("#container").css("cursor", "pointer")
        this._isMouseDown = true
        this._isInCanvas = true
        this._x = e.offsetX
        this._y = e.offsetY
        this._draw(e)
    },

    mouseup(e) {
        this._isMouseDown = false
        $("#container").css("cursor", this._originMouseCursor)
    },

    mouseover(e) {
        this._isInCanvas = true
        this._x = e.offsetX
        this._y = e.offsetY
        if (this._isMouseDown) {
            $("#container").css("cursor", "pointer")
        }
    },

    mouseout(e) {
        this._isInCanvas = false
        $("#container").css("cursor", this._originMouseCursor)
    },

    mousemove(e) {
        if (this._isMouseDown === true && this._isInCanvas === true) {
            this._draw(e)
        }
    },

    _draw(e) {
        ctx.beginPath()
        ctx.moveTo(this._x, this._y)
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke()
        this._x = e.offsetX
        this._y = e.offsetY
    }
}