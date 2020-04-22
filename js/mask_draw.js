"use strict"

var mask = {
    isMouseDown: false,
    isInCanvas: false,
    x: 0,
    y: 0,
    originMouseCursor: null,

    mousedown: function(e) {
        this.originMouseCursor = $("#container").css("cursor")
        $("#container").css("cursor", "cell")
        this.isMouseDown = true
        console.log(this.isInCanvas)
        this.x = e.offsetX
        this.y = e.offsetY
        this.reDrawBackground()
        this.drawMask(e)
    },

    mouseup: function(e) {
        this.isMouseDown = false
        $("#container").css("cursor", this.originMouseCursor)
    },

    mouseover: function(e) {
        this.isInCanvas = true
        if (this.isMouseDown) {
            $("#container").css("cursor", "cell")
        }
    },

    mouseout: function(e) {
        this.isInCanvas = false
        $("#container").css("cursor", this.originMouseCursor)
    },

    mousemove: function(e) {
        if (this.isMouseDown == true && this.isInCanvas == true) {
            //this.draw(e)
        }

    },

    reDrawBackground: function() {
        clearCanvas(false)
        ctx.fillStyle = "rgba(115, 115, 115, 0.8)"
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    },

    drawMask: function(e) {
        ctx.globalCompositeOperation = "destination-out"
        ctx.beginPath()
        ctx.arc(e.offsetX, e.offsetY, 50, 0, 2 * Math.PI)
        ctx.fill()
        ctx.globalCompositeOperation = "source-over"
    }
}