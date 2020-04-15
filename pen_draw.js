"use strict"

var pen = {
    colors: {
        "紅色": "#f542a7",
        "黃色": "#e8c62e",
        "藍色": "#0033cc"
    },

    mousedown: function(e) {
        originMouseCursor = $("#container").css("cursor")
        $("#container").css("cursor", "pointer")
        isMouseDown = true
        x = e.offsetX
        y = e.offsetY
        this.draw(e)
    },

    mouseup: function(e) {
        isMouseDown = false
        $("#container").css("cursor", originMouseCursor)
    },

    mouseover: function(e) {
        isInCanvas = true
        if (isMouseDown) {
            $("#container").css("cursor", "pointer")
        }
    },

    mouseout: function(e) {
        isInCanvas = false
        $("#container").css("cursor", originMouseCursor)
    },

    mousemove: function(e) {
        this.draw(e)
    },

    draw: function(e) {
        if (isMouseDown == true && isInCanvas == true) {
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke()
            x = e.offsetX
            y = e.offsetY
        }
    }
}