"use strict"

// 設定 Canvas 畫布、繪圖物件、開發模式
var ctx = $("#canvas_area")[0].getContext("2d")
var drawObj = {
    "1": pen,
    "2": mask,
    "3": pathMask,
    "4": polygon
}

// 初始化繪圖界面、繪圖物件
canvasNav.initDrawUI()
canvasNav.setupDrawObj()

// 綁定畫筆類型變更，設定繪圖物件
$("#pen_type").on("change", function() {
    canvasNav.setupDrawObj()
})

// 設定畫筆、多邊形顏色設定後，選項跟著變換顏色
$("#pen_color, #polygon_color").on("change", function(e) {
    let changedColorObj = $(e.target).closest(".property_item").children("select")
    changedColorObj.css("color", changedColorObj.val())
})

// 綁定滑鼠在 canvas 上的動作，由繪圖物件實現方法
$("#canvas_area").on("mousedown mouseup mouseover mouseout mousemove dblclick", function(e) {
    if (drawObj[$("#pen_type").val()].hasOwnProperty(e.type)) {
        drawObj[$("#pen_type").val()][e.type](e)
    } else {
        e.preventDefault()
    }
})