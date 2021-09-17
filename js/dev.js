// 是否進入開發模式
var developmentMode = 0

// 設定開發模式
if (developmentMode === 1) {
    // 繪圖區域
    $("#canvas_area").show().css({
        border: "2px solid grey",
        marginTop: "4em"
    })
    $("#video_content").css("top", "4em")
    ctx.canvas.width = window.innerWidth * 0.85
    ctx.canvas.height = window.innerHeight * 0.85
    $("#container").css("position", "inherit")
    $("#select_video_button").hide()
    canvasNav.initDrawUI()
    canvasNav.setupDrawObj()

    // 註解部份
    $("#comment_source").show().css("margin-left", "12em")
    $("#add_comment").css("display", "inline-block")
    commentList.appendItem(0, {
        "time": 58,
        "title": "註解1",
        "position": "right_down",
        "text": "這個傳球要看另外一邊",
        "duration": 10
    })
    commentList.show()
}