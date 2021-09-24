"use strict"

// 設定 Canvas 畫布、繪圖物件、開發模式
var ctx = $("#canvas_area")[0].getContext("2d")
var drawObj = {
    "1": pen,
    "2": mask,
    "3": pathMask
}

// 初始化繪圖界面、繪圖物件
canvasNav.initDrawUI()
canvasNav.setupDrawObj()

// 綁定畫筆類型變更，設定繪圖物件
$("#pen_type").on("change", function() {
    canvasNav.setupDrawObj()
})

// 設定畫筆顏色設定後，選項跟著變換顏色
$("#pen_color").on("change", function() {
    $("#pen_color").css("color", $("#pen_color").val())
})

// 綁定滑鼠在 canvas 上按下動作
$("#canvas_area").on("mousedown", function(e) {
    drawObj[$("#pen_type").val()].mousedown(e)
})

// 綁定滑鼠在 canvas 上放開動作
$("#canvas_area").on("mouseup", function(e) {
    drawObj[$("#pen_type").val()].mouseup(e)
})

// 綁定滑鼠進入 canvas 動作
$("#canvas_area").on("mouseover", function(e) {
    drawObj[$("#pen_type").val()].mouseover(e)
})

// 綁定滑鼠移出 canvas 動作
$("#canvas_area").on("mouseout", function(e) {
    drawObj[$("#pen_type").val()].mouseout(e)
})

// 綁定滑鼠在 canvas 上移動動作
$("#canvas_area").on("mousemove", function(e) {
    drawObj[$("#pen_type").val()].mousemove(e)
})