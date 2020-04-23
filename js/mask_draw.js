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
        this.x = e.offsetX
        this.y = e.offsetY
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
        ctx.fillStyle = "rgba(115, 115, 115, 0.8)"
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    },

    drawCircleMask: function(e, scale = 1) {
        ctx.globalCompositeOperation = "destination-out"
        ctx.beginPath()
        ctx.arc(e.offsetX, e.offsetY, parseInt($("#mask_size").val()) * scale, 0, 2 * Math.PI)
        ctx.fill()
        ctx.globalCompositeOperation = "source-over"
    },

    drawPathMask: function(e) {
        ctx.globalCompositeOperation = "destination-out"
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke()
        ctx.globalCompositeOperation = "source-over"
    }
}