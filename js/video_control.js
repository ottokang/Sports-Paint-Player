"use strict"

// 初始化影片物件、影片是否縮放、縮放基準座標
var video = $("#video_content")[0],
    isResized = false,
    resizeXOffset,
    resizeYOffset

// 綁定影片選擇後動作，選擇影像後播放
$("#video_source").on("change", function() {
    let file = this.files[0]
    if (video.canPlayType(file.type) === "") {
        showMessage(`瀏覽器無法播放此類影片（${file.type}），建議將影片轉檔為 H.264 + AAC 格式。`, 6)
        return
    } else {
        $("#video_source").show()
        $("#select_video_button").hide()
        $("#select_comment_button").css("display", "inline-block")
        showMessage("開始播放", 1)
        video.src = URL.createObjectURL(file)
        // 轉移焦點到 video上，避免空白鍵再度觸發選擇影像檔案
        $("#video_content").focus()
    }
})

// 綁定播放進度列點擊事件
$("#video_progress").on("click", function() {
    video.currentTime = $("#video_progress").val()
})

// 綁定影片時間變化時更新進度列
$("#video_content").on("timeupdate", function() {
    $("#video_progress").val(video.currentTime)
    $("#current_time").html(video.currentTime.toString().toHHMMSS())
})

// 綁定滑鼠移動時紀錄座標，作為影片縮放基準
$("#canvas_area").on("mousemove", function(e) {
    resizeXOffset = parseInt(e.offsetX / ctx.canvas.width * 100)
    resizeYOffset = parseInt(e.offsetY / ctx.canvas.height * 100)
})

// 綁定影片長度變更時，設定播放進度列、播放資訊、container 高度/寬度
$("#video_content").on("durationchange", function() {
    // 根據螢幕大小，設定 Container 大小
    let maxViewWidth = $(window).width() * 0.90
    let maxViewHeight = $(window).height() * 0.88
    let videoAspectRatio = video.videoWidth / video.videoHeight
    let screenAspectRatio = maxViewWidth / maxViewHeight

    if (videoAspectRatio >= screenAspectRatio) {
        var containerWidth = parseInt(maxViewWidth)
        var conatinerHeight = parseInt(video.videoHeight * (maxViewWidth / video.videoWidth))
    } else {
        var containerWidth = parseInt(video.videoWidth * (maxViewHeight / video.videoHeight))
        var conatinerHeight = parseInt(maxViewHeight)
    }

    // 設定 Container 寬、高、Margin-Top 距離
    $("#container").width(containerWidth)
    $("#container").height(conatinerHeight)
    $("#container").css("margin-top", (maxViewHeight - conatinerHeight) / 2 + "px")
    $("#video_content").width(containerWidth)
    $("#video_content").height(conatinerHeight)

    // 設定播放進度時間、播放資訊
    $("#total_time").html(video.duration.toString().toHHMMSS())
    $("#video_progress").width(containerWidth)
    $("#video_progress").prop("max", video.duration)
    $("#video_progress").css("display", "block")
    $(".video_info").css("display", "block")
    $("#playback_speed").html(Math.floor(video.playbackRate * 100))

    // 設定 Canvas 大小、設定繪圖界面、物件
    $("#canvas_area").show()
    ctx.canvas.width = containerWidth
    ctx.canvas.height = conatinerHeight
    initDrawUI()
    setupDrawObj()
})

// 播放/暫停
function playPause() {
    if (video.paused) {
        video.play()
        showOSD("繼續", "center", "increase")
    } else {
        video.pause()
        showOSD("暫停", "center", "increase")
    }
}

// 跳躍秒數設定
function jump(seconds) {
    video.currentTime = video.currentTime + seconds
    if (seconds > 0) {
        showOSD(`+${seconds}秒`, "right", "right")
    } else {
        showOSD(`${seconds}秒`, "left", "left")
    }
}

// 設定播放速度
function setPlaybackRate(percentage) {
    if (percentage == "100") {
        video.playbackRate = 1.0
        showOSD("恢復播放速度", "center", "none")
    } else if (percentage > 0 && video.playbackRate < 2) {
        video.playbackRate = Number.parseFloat(video.playbackRate + percentage / 100).toFixed(2)
        showOSD(`播放速度${percentage}%`, "center", "increase")
    } else if (percentage < 0 && video.playbackRate > 0.3) {
        video.playbackRate = Number.parseFloat(video.playbackRate + percentage / 100).toFixed(2)
        showOSD(`播放速度${percentage}%`, "center", "decrease")
    }
    $("#playback_speed").html(Math.floor(video.playbackRate * 100))
}

// 快速倒轉
function fastReversePlay(seconds) {
    showOSD(`快速倒轉${seconds}秒`, "center", "increase", seconds * 500)
    var originTime = video.currentTime
    var fastForwardInterval = setInterval(function() {
        video.currentTime -= 0.2
        if (video.currentTime < originTime - seconds || video.currentTime < 0.5) {
            clearInterval(fastForwardInterval)
        }
    }, 50)
}

// 放大影像
function zoomIn() {
    if (!isResized) {
        $("#video_content").css("transform-origin", resizeXOffset + "% " + resizeYOffset + "%")
        $("#video_content").css("transform", "scale(" + $("#resize_radio").val() + ")")
        $("#video_size").html("放大" + $("#resize_radio").val() + "倍")
        $("#video_size").css("color", "red")
        $("#video_size").css("font-size", "130%")
        showOSD("放大" + $("#resize_radio").val() + "倍", "center", "increase")
        isResized = true
    }
}

// 還原影像大小
function zoomDefault() {
    if (isResized) {
        $("#video_content").css("transform", "scale(1)")
        $("#video_size").html("標準大小")
        $("#video_size").css("color", "#ffffff")
        $("#video_size").css("font-size", "100%")
        showOSD("標準大小", "center", "decrease")
        isResized = false
    }
}

// 顯示訊息
function showMessage(message, countDown = 2) {
    $("#message").html(message).show()
    var messageInterval = setInterval(function() {
        $("#message").hide("slow")
        clearInterval(messageInterval)
    }, countDown * 1000)
}

// 顯示影片 OSD 訊息
function showOSD(text, position = "center", fadeOut = "increase", fadeOutTime = 1000) {
    $("#video_osd").finish().removeAttr("style")
    $("#video_osd").html(text)
    $("#video_osd").show()
    $("#video_osd").attr("class", `osd_${position}`)
    // OSD 訊息置中（使用 transform -50％會影響動畫效果）
    $("#video_osd").css("margin-left", -($("#video_osd").width() / 2))
    $("#video_osd").css("margin-top", -($("#video_osd").height() / 2))

    switch (fadeOut) {
        case "increase":
            $("#video_osd").css("transform", "scale(1.2)")
            break
        case "decrease":
            $("#video_osd").css("transform", "scale(0.8)")
            break
        case "right":
            $("#video_osd").css("transform", "translate(1em)")
            break
        case "left":
            $("#video_osd").css("transform", "translate(-1em)")
            break
        case "none":
            break
    }

    $("#video_osd").animate({
        opacity: "0"
    }, fadeOutTime, function() {
        $(this).hide()
    })
}

// 處理播放時間為時:分:秒
String.prototype.toHHMMSS = function() {
    let sec_num = parseInt(this, 10)
    let hours = Math.floor(sec_num / 3600)
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
    let seconds = sec_num - (hours * 3600) - (minutes * 60)

    if (hours < 10) {
        hours = `0${hours}`
    }
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    return hours + ":" + minutes + ":" + seconds
}