"use strict"

var pathMask = {
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
            canvasNav.clearCanvas(false)
            ctx.putImageData(this._backgroudCanvasData, 0, 0)
            this._drawPathMask(e)
            this._drawCircleMask(e, parseFloat($("#path_mask_scale").val()))
        }
    },

    _reDrawBackground() {
        canvasNav.clearCanvas(false)
        ctx.globalCompositeOperation = "source-over"
        ctx.fillStyle = `rgba(30, 30, 30, ${$("#path_mask_transparency").val()})`
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    },

    _drawCircleMask(e, scale = 1) {
        ctx.globalCompositeOperation = "destination-out"
        ctx.fillStyle = "#000000" // 設定為不透明色，組合圖片可以正確透明
        ctx.beginPath()
        ctx.arc(e.offsetX, e.offsetY, parseInt($("#path_mask_radius").val()) * scale, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()
        ctx.globalCompositeOperation = "source-over"
    },

    _drawPathMask(e) {
        let pathMaskCoordinates1 = this._getPathMaskCoordinates(this._x, this._y,
            e.offsetX, e.offsetY, parseInt($("#path_mask_radius").val()))
        let pathMaskCoordinates2 = this._getPathMaskCoordinates(e.offsetX, e.offsetY,
            this._x, this._y, parseInt($("#path_mask_radius").val()) * parseFloat($("#path_mask_scale").val()))
        ctx.globalCompositeOperation = "destination-out"
        ctx.fillStyle = "#000000"
        ctx.beginPath()
        ctx.moveTo(pathMaskCoordinates1.x1, pathMaskCoordinates1.y1)
        ctx.lineTo(pathMaskCoordinates1.x2, pathMaskCoordinates1.y2)
        ctx.lineTo(pathMaskCoordinates2.x1, pathMaskCoordinates2.y1)
        ctx.lineTo(pathMaskCoordinates2.x2, pathMaskCoordinates2.y2)
        ctx.closePath()
        ctx.fill()
        ctx.globalCompositeOperation = "source-over"
    },

    _getPathMaskCoordinates(baseX, baseY, faceX, faceY, radius) {
        let result = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        }
        let x_distance = (faceX - baseX)
        let y_distance = (faceY - baseY)
        let degree = Math.atan2(y_distance, x_distance) * 180 / Math.PI

        result.x1 = baseX + radius * Math.cos((degree + 90) * Math.PI / 180)
        result.y1 = baseY + radius * Math.sin((degree + 90) * Math.PI / 180)
        result.x2 = baseX + radius * Math.cos((degree - 90) * Math.PI / 180)
        result.y2 = baseY + radius * Math.sin((degree - 90) * Math.PI / 180)
        return result
    }
}