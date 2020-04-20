"use strict"

var mask = {
    isMouseDown: false,
    isInCanvas: false,
    x: 0,
    y: 0,
    originMouseCursor: null,
    isMaskBackground: false,

    mousedown: function(e) {
        this.originMouseCursor = $("#container").css("cursor")
        $("#container").css("cursor", "cell")
        this.isMouseDown = true
        this.x = e.offsetX
        this.y = e.offsetY
        this.isMaskBackground = false
        clearCanvas(false)
        this.draw(e)
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
        this.draw(e)
    },

    draw: function(e) {
        // 如果沒有畫背景，且滑鼠按下，則重新繪製背景
        if (this.isMaskBackground == false && this.isMouseDown == true) {
            ctx.fillStyle = "rgba(115, 115, 115, 0.5)"
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            this.isMaskBackground = true
        }

        if (this.isMouseDown == true && this.isInCanvas == true) {}
    }
}