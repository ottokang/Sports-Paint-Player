"use strict";

// 是否進入開發模式
var developmentMode = 0;
//developmentMode = 1;

// 設定開發模式
if (developmentMode === 1) {
    // 繪圖區域
    $("#canvas_area").show().css({
        border: "2px solid grey",
        marginTop: "4em",
    });
    $("#video_content").css("top", "4em");
    ctx.canvas.width = window.innerWidth * 0.85;
    ctx.canvas.height = window.innerHeight * 0.85;
    $("#container").css("position", "inherit");
    $("#select_video_button").hide();

    // 顯示影片控制、標記界面
    $("#video_source").show().css("margin-left", "6em");
    $("#control, #draw_property").show();

    // 設定註解
    $("#comment_source").show().css("margin-left", "1em");
    $("#add_comment").css("display", "inline-block");
    commentList.appendItem(0, {
        time: 58,
        title: "註解 1",
        position: "right_down",
        text: "這個傳球要看另外一邊",
        duration: 10,
    });
    commentList.appendItem(1, {
        time: 28,
        title: "註解 2",
        position: "center",
        text: "註解 2",
        duration: 10,
    });
    commentList.show();
}
