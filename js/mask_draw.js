"use strict"

var mask = {
    isMouseDown: false,
    isInCanvas: false,
    x: 0,
    y: 0,
    originMouseCursor: null,
    backgroudCanvasData: null,

    init: function() {
        $("#container").css("cursor", "auto")
        return this
    },

    mousedown: function(e) {
        this.originMouseCursor = $("#container").css("cursor")
        $("#container").css("cursor", "grabbing")
        this.isMouseDown = true
        this.isInCanvas = true
        this.x = e.offsetX
        this.y = e.offsetY
        this.reDrawBackground()
        this.drawCircleMask(e)
        this.backgroudCanvasData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    },

    mouseup: function(e) {
        this.isMouseDown = false
        $("#container").css("cursor", this.originMouseCursor)
    },

    mouseover: function(e) {
        this.isInCanvas = true
        if (this.isMouseDown) {
            $("#container").css("cursor", "grabbing")
        }
    },

    mouseout: function(e) {
        this.isInCanvas = false
        $("#container").css("cursor", this.originMouseCursor)
    },

    mousemove: function(e) {
        $("#container").css("cursor", "grab")
        if (this.isMouseDown == true && this.isInCanvas == true) {
            clearCanvas(false)
            ctx.putImageData(this.backgroudCanvasData, 0, 0)
            this.drawCircleMask(e, parseFloat($("#mask_scale").val()))
            this.drawPathMask(e)
        }
    },

    reDrawBackground: function() {
        clearCanvas(false)
        ctx.fillStyle = `rgba(30, 30, 30, ${$("#mask_transparency").val()})`
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    },

    drawCircleMask: function(e, scale = 1) {
        ctx.globalCompositeOperation = "destination-out"
        ctx.beginPath()
        ctx.arc(e.offsetX, e.offsetY, parseInt($("#mask_radius").val()) * scale, 0, 2 * Math.PI)
        ctx.fill()
        ctx.globalCompositeOperation = "source-over"
    },

    drawPathMask: function(e) {
        let pathMaskCoordinates1 = this.getPathMaskCoordinates(this.x, this.y,
            e.offsetX, e.offsetY, parseInt($("#mask_radius").val()))
        let pathMaskCoordinates2 = this.getPathMaskCoordinates(e.offsetX, e.offsetY,
            this.x, this.y, parseInt($("#mask_radius").val()) * parseFloat($("#mask_scale").val()))
        ctx.globalCompositeOperation = "destination-out"
        ctx.beginPath()
        ctx.moveTo(pathMaskCoordinates1.x1, pathMaskCoordinates1.y1)
        ctx.lineTo(pathMaskCoordinates1.x2, pathMaskCoordinates1.y2)
        ctx.lineTo(pathMaskCoordinates2.x1, pathMaskCoordinates2.y1)
        ctx.lineTo(pathMaskCoordinates2.x2, pathMaskCoordinates2.y2)
        ctx.closePath()
        ctx.fill()
        ctx.globalCompositeOperation = "source-over"
    },

    getPathMaskCoordinates: function(baseX, baseY, faceX, faceY, radius) {
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