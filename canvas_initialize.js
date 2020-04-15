"use strict"

// 影片縮放基準座標
var resizeXOffset, resizeYOffset

// 紀錄原先的滑鼠指標
var originMouseCursor

// 設定 Canvas 畫布
var canvas = $("#canvas_area")
var ctx = $("#canvas_area")[0].getContext("2d")

// 設定繪圖物件
var drawObj = pen,
    isMouseDown = false,
    isInCanvas = false,
    x = 0,
    y = 0

// 綁定影片啟動時設定 canvas 大小、筆跡樣式
$("#video_content").on("durationchange", function() {
    canvas.show()
    ctx.canvas.width = $("#video_content").width()
    ctx.canvas.height = $("#video_content").height()
    ctx.strokeStyle = $("#pen_color").val()
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctx.lineWidth = 5
})

// 綁定畫筆類型變更選單效果
$("#pen_type").on("change", function() {
    $("[class*='pen_type_id_']").hide()
    $(".pen_type_id_" + $("#pen_type").val()).show()

    switch ($("#pen_type").val()) {
        case "1":
            drawObj = pen
            break
        case "2":
            drawObj = null
            break
    }
})

// 設定畫筆顏色選項
$.each(pen.colors, function(colorName, value) {
    var optionElement = document.createElement("option")
    optionElement.setAttribute("value", value)
    optionElement.style.color = value
    optionElement.innerHTML = colorName
    $("#pen_color").append(optionElement)
})

// 設定畫筆顏色設定顏色變換效果
$("#pen_color").css("color", $("#pen_color").val())
$("#pen_color").change(function() {
    ctx.strokeStyle = $("#pen_color").val()
    $("#pen_color").css("color", $("#pen_color").val())
})

// 綁定滑鼠按下動作
canvas.mousedown(function(e) {
    drawObj.mousedown(e)
})

// 綁定滑鼠放開動作
canvas.mouseup(function(e) {
    drawObj.mouseup(e)
})

// 綁定滑鼠進入canvas動作
canvas.mouseover(function(e) {
    drawObj.mouseover(e)
})

// 綁定滑鼠移出canvas動作
canvas.mouseout(function(e) {
    drawObj.mouseout(e)
})

// 綁定滑鼠在canvas上移動動作
canvas.mousemove(function(e) {
    drawObj.mousemove(e)
    // 紀錄滑鼠座標，作為縮放基準座標
    resizeXOffset = parseInt(e.offsetX / ctx.canvas.width * 100)
    resizeYOffset = parseInt(e.offsetY / ctx.canvas.height * 100)
})

// 清空畫布
function clearCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    showOsd("清除筆跡", "center", "increase")
}