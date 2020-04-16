"use strict"

var pen = {
    isMouseDown: false,
    isInCanvas: false,
    x: 0,
    y: 0,
    originMouseCursor: null,
    colors: {
        "紅色": "#f542a7",
        "黃色": "#e8c62e",
        "藍色": "#0033cc"
    },

    mousedown: function(e) {
        this.originMouseCursor = $("#container").css("cursor")
        $("#container").css("cursor", "pointer")
        this.isMouseDown = true
        this.x = e.offsetX
        this.y = e.offsetY
        this.draw(e)
    },

    mouseup: function(e) {
        this.isMouseDown = false
        $("#container").css("cursor", this.originMouseCursor)
    },

    mouseover: function(e) {
        this.isInCanvas = true
        if (this.isMouseDown) {
            $("#container").css("cursor", "pointer")
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
        if (this.isMouseDown == true && this.isInCanvas == true) {
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke()
            this.x = e.offsetX
            this.y = e.offsetY
        }
    }
}