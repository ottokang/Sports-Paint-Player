"use strict"

var mask = {
    _isMouseDown: false,
    _isInCanvas: false,
    _x: 0,
    _y: 0,
    _originMouseCursor: null,
    _backgroudCanvasData: null,

    setup() {
        $("#container").css("cursor", "auto")
        return this
    },

    mousedown(e) {
        this._originMouseCursor = $("#container").css("cursor")
        $("#container").css("cursor", "grabbing")
        this._isMouseDown = true
        this._isInCanvas = true
        this._x = e.offsetX
        this._y = e.offsetY
        this._reDrawBackground()
        this._drawCircleMask(e)
        this._backgroudCanvasData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    },

    mouseup(e) {
        this._isMouseDown = false
        $("#container").css("cursor", this._originMouseCursor)
    },

    mouseover(e) {
        this._isInCanvas = true
        if (this._isMouseDown) {
            $("#container").css("cursor", "grabbing")
        }
    },

    mouseout(e) {
        this._isInCanvas = false
        $("#container").css("cursor", this._originMouseCursor)
    },

    mousemove(e) {
        $("#container").css("cursor", "grab")
        if (this._isMouseDown == true && this._isInCanvas == true) {
            clearCanvas(false)
            ctx.putImageData(this._backgroudCanvasData, 0, 0)
            this._drawCircleMask(e, parseFloat($("#mask_scale").val()))
        }
    },

    _reDrawBackground() {
        clearCanvas(false)
        ctx.globalCompositeOperation = "source-over"
        ctx.fillStyle = `rgba(30, 30, 30, ${$("#mask_transparency").val()})`
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    },

    _drawCircleMask(e, scale = 1) {
        ctx.globalCompositeOperation = "destination-out"
        ctx.fillStyle = "#000000" // 設定為不透明色，組合圖片可以正確透明
        ctx.beginPath()
        ctx.arc(e.offsetX, e.offsetY, parseInt($("#mask_radius").val()) * scale, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()
        ctx.globalCompositeOperation = "source-over"
    }
}