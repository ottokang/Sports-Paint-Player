"use strict"

// 設定影片放大基準位置
var resizeXOffset, resizeYOffset

// 設定 Canvas 畫布
var canvas = $("#canvas_area")
var ctx = $("#canvas_area")[0].getContext("2d")
let isMouseDown = false,
    isInCanvas = false,
    x = 0,
    y = 0

$(function() {
    // 綁定選擇筆跡顏色動作、文字顏色變更為筆跡顏色
    $("#pen_color").css("color", $("#pen_color").val())
    $("#pen_color").change(function() {
        ctx.strokeStyle = $("#pen_color").val()
        $("#pen_color").css("color", $("#pen_color").val())
    })
    $("#pen_color option").each(function(index) {
        $(this).css("color", $(this).val())
    })
})

// 影片啟動時設定 canvas 大小、筆跡樣式
$("#video_content").on("durationchange", function() {
    canvas.show()
    ctx.canvas.width = $("#video_content").width()
    ctx.canvas.height = $("#video_content").height()
    ctx.strokeStyle = $("#pen_color").val()
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctx.lineWidth = 5
})

// 綁定滑鼠下筆動作
canvas.mousedown(function(e) {
    isMouseDown = true
    x = e.offsetX
    y = e.offsetY
    draw(e)
})

canvas.mouseup(function(e) {
    isMouseDown = false
})

canvas.mouseover(function() {
    isInCanvas = true
})

canvas.mouseout(function(e) {
    isInCanvas = false
})

canvas.mousemove(function(e) {
    draw(e)
    // 紀錄滑鼠座標，作為放大縮小用
    resizeXOffset = parseInt(e.offsetX / ctx.canvas.width * 100)
    resizeYOffset = parseInt(e.offsetY / ctx.canvas.height * 100)
})

// 下筆
function draw(e) {
    if (isMouseDown == true && isInCanvas == true) {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke()
        x = e.offsetX
        y = e.offsetY
    }
}

// 清空畫布
function clearCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    showOsd("清除筆跡", "center", "increase")
}