"use strict";

// 進度列是否按下、影片是否縮放、縮放基準座標、影片物件
var isProgressbarMousedown = false;
var isResized = false;
var resizeXOffset;
var resizeYOffset;
var video = $("#video_content")[0];

// 綁定螢幕畫面大小改變偵測說明
$(window).on("resize", function () {
    $("#resize_message").show();
});

// 綁定靜音按鈕動作
$("#is_mute").on("click", function () {
    videoNav.toggleMute();
});

// 綁定影片選擇後動作，選擇影像後播放
$("#video_source").on("change", function () {
    let videoFile = this.files[0];

    // 若取消選擇檔案，直接結束
    if (videoFile === undefined) {
        return;
    }

    if (video.canPlayType(videoFile.type) === "") {
        canvasNav.showMessage(`瀏覽器無法播放此類影片（${videoFile.type}），建議將影片轉檔為 H.264 + AAC 格式。`, 6);
        return;
    } else {
        videoNav.setMute();
        $("#video_source").show();
        $("#select_video_button, #instruction").hide();
        $("#select_comment_button, #add_comment").css("display", "inline-block");
        commentList.reset();
        canvasNav.showMessage("開始播放", 1);
        video.src = URL.createObjectURL(videoFile);
    }
});

// 綁定播放進度列點擊事件，拖曳也可以作用
$("#video_progress").on("click mousedown mouseup mousemove", function (event) {
    if (event.type === "mousedown") {
        isProgressbarMousedown = true;
    }

    if (event.type === "click" || (isProgressbarMousedown === true && "mousemove")) {
        video.currentTime = $("#video_progress").val();

        // 點選進度列，新增/編輯註解時間會提示效果
        $("#comment_time_HHMMSS").addClass("comment_input_focus");
        window.setTimeout(function () {
            $("#comment_time_HHMMSS").removeClass("comment_input_focus");
        }, 200);
    }

    if (event.type === "mouseup") {
        isProgressbarMousedown = false;
    }
});

// 綁定影片時間變化時更新進度列、更新註解時間
$("#video_content").on("timeupdate", function () {
    $("#current_time").html(video.currentTime.toString().toHHMMSS());
    $("#comment_time_HHMMSS").val(video.currentTime.toString().toHHMMSS());
    if (isProgressbarMousedown === false) {
        $("#video_progress").val(video.currentTime);
    }
});

// 綁定滑鼠移動時紀錄座標，作為影片縮放基準
$("#canvas_area").on("mousemove", function (e) {
    resizeXOffset = Number((e.offsetX / ctx.canvas.width) * 100);
    resizeYOffset = Number((e.offsetY / ctx.canvas.height) * 100);
});

// 綁定影片長度變更時，設定播放進度列、播放資訊、container 高度/寬度
$("#video_content").on("durationchange", function () {
    // 根據螢幕大小，設定 Container 大小
    let maxViewWidth = window.innerWidth * 0.9;
    let maxViewHeight = window.innerHeight * 0.86;
    let videoAspectRatio = video.videoWidth / video.videoHeight;
    let screenAspectRatio = maxViewWidth / maxViewHeight;
    let containerWidth, conatinerHeight;
    if (videoAspectRatio >= screenAspectRatio) {
        containerWidth = Number.parseInt(maxViewWidth);
        conatinerHeight = Number.parseInt(video.videoHeight * (maxViewWidth / video.videoWidth));
    } else {
        containerWidth = Number.parseInt(video.videoWidth * (maxViewHeight / video.videoHeight));
        conatinerHeight = Number.parseInt(maxViewHeight);
    }

    // 設定 Container 寬、高、Margin-Top 距離
    $("#container").width(containerWidth);
    $("#container").height(conatinerHeight);
    $("#container").css("margin-top", (maxViewHeight - conatinerHeight) / 2 + 10 + "px");
    $("#video_content").width(containerWidth);
    $("#video_content").height(conatinerHeight);

    // 設定播放進度時間、播放資訊
    $("#total_time").html(video.duration.toString().toHHMMSS());
    $("#video_progress").width(containerWidth);
    $("#back_time").width(containerWidth - 8);
    $("#video_progress").show().prop("max", video.duration);
    $(".video_info").show();
    $("#playback_speed").html(Math.floor(video.playbackRate * 100) + "%");

    // 設定 Canvas 大小、設定繪圖界面、物件
    $("#canvas_area").show();
    ctx.canvas.width = containerWidth;
    ctx.canvas.height = conatinerHeight;

    // 顯示控制介面、標記界面
    $("#control, #draw_property").show();
});

// 處理播放時間為時:分:秒
String.prototype.toHHMMSS = function () {
    let secondsNumber = Number.parseInt(this, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let seconds = secondsNumber - hours * 3600 - minutes * 60;

    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return hours + ":" + minutes + ":" + seconds;
};
