"use strict"

var video = $("#video_content")[0]
var isResized = false

// 選擇影像後播放
$("#video_source").change(function() {
    let file = this.files[0]
    if (video.canPlayType(file.type) === "") {
        showMessage("瀏覽器無法播放此檔案類型：" + file.type)
        return
    } else {
        showMessage("可播放，檔案類型：" + file.type)
        video.src = URL.createObjectURL(file)
        // 轉移焦點到 video上，避免空白鍵再度觸發選擇影像檔案
        $("#video_content").focus()
    }

    // 設定播放進度列、顯示播放資訊、設定 container 高度、寬度
    $("#video_content").on("durationchange", function() {
        // 根據螢幕大小，設定 Container 大小
        var maxViewWidth = $(window).width() * 0.97
        var maxViewHeight = $(window).height() * 0.88
        var videoAspectRatio = video.videoWidth / video.videoHeight
        var screenAspectRatio = maxViewWidth / maxViewHeight

        if (videoAspectRatio >= screenAspectRatio) {
            var containerWidth = maxViewWidth
            var conatinerHeight = video.videoHeight * (maxViewWidth / video.videoWidth)
        } else {
            var containerWidth = video.videoWidth * (maxViewHeight / video.videoHeight)
            var conatinerHeight = maxViewHeight
        }

        // 設定 Container 寬、高
        $("#container").width(containerWidth)
        $("#container").height(conatinerHeight)
        $("#video_content").width(containerWidth)
        $("#video_content").height(conatinerHeight)
        $("#video_progress").width(containerWidth)
        $("#video_progress").prop('max', video.duration)
        $("#video_progress").css("display", "block")
        $(".video_info").css("display", "block")
        $("#playback_speed").html(Math.floor(video.playbackRate * 100))
    })

    // 綁定播放進度列點擊事件
    $("#video_progress").click(function() {
        video.currentTime = $("#video_progress").val()
    })

    // 定時更新進度列、播放資訊
    setInterval(function() {
        $("#video_progress").val(video.currentTime)
        $("#current_time").html(video.currentTime.toString().toHHMMSS())
        $("#total_time").html(video.duration.toString().toHHMMSS())
    }, 500)
})

// 播放、暫停
function playPause() {
    if (video.paused) {
        video.play()
        showOsd("繼續", "center", "increase")
    } else {
        video.pause()
        showOsd("暫停", "center", "increase")
    }
}

// 跳躍秒數設定
function jump(seconds) {
    video.currentTime = video.currentTime + seconds
    if (seconds > 0) {
        showOsd("+" + seconds + "秒", "right", "right")
    } else {
        showOsd("" + seconds + "秒", "left", "left")
    }
}

// 播放速度設定
function speed(percentage) {
    if (percentage == "100") {
        video.playbackRate = 1.0
        showOsd("恢復播放速度", "center", "increase")
    } else if (percentage > 0 && video.playbackRate < 2) {
        video.playbackRate += (percentage / 100)
        showOsd("播放速度+" + percentage + "%", "center", "increase")
    } else if (percentage < 0 && video.playbackRate > 0.3) {
        video.playbackRate += (percentage / 100)
        showOsd("播放速度" + percentage + "%", "center", "decrease")
    }
    $("#playback_speed").html(Math.floor(video.playbackRate * 100))
}

// 快速倒轉
function fastReversePlay(seconds) {
    showOsd("快速倒轉" + seconds + "秒", "center", "increase", seconds * 400)
    var originTime = video.currentTime
    var fastForwardinterval = setInterval(function() {
        video.currentTime -= 0.2
        if (video.currentTime < originTime - seconds || video.currentTime < 0.5) {
            clearInterval(fastForwardinterval)
        }
    }, 50)
}

// 放大影像
function zoomIn() {
    if (!isResized) {
        $("#video_content").css("transform-origin", resizeXOffset + "% " + resizeYOffset + "%")
        $("#video_content").css("transform", "scale(" + $("#resize_radio").val() + ")")
        $("#container").css("cursor", "zoom-in")
        $("#video_resized").html("放大" + $("#resize_radio").val() + "倍")
        $("#video_resized").css("color", "red")
        $("#video_resized").css("font-size", "130%")
        showOsd("放大" + $("#resize_radio").val() + "倍", "center", "increase")
        isResized = true
    }
}

// 還原影像大小
function zoomDefault() {
    if (isResized) {
        $("#video_content").css("transform", "scale(1)")
        $("#container").css("cursor", "default")
        $("#video_resized").html("標準大小")
        $("#video_resized").css("color", "#ffffff")
        $("#video_resized").css("font-size", "100%")
        showOsd("標準大小", "center", "decrease")
        isResized = false
    }
}

// 顯示訊息
function showMessage(message) {
    $("#message").html(message)
}

// 顯示影片 OSD 訊息
function showOsd(text, position = "center", fadeOut = "increase", fadeOutTime = 500) {
    $("#video_osd").remove()
    $("#video_resized").after('<div id="video_osd"></div>')
    $("#video_osd").html(text)
    $("#video_osd").show()
    $("#video_osd").attr("class", "osd_" + position)
    // OSD 訊息置中
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
    }

    $("#video_osd").animate({
        opacity: "0"
    }, fadeOutTime, function() {
        $(this).remove()
    })
}

// 處理播放時間為時:分:秒
String.prototype.toHHMMSS = function() {
    var sec_num = parseInt(this, 10)
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60)
    var seconds = sec_num - (hours * 3600) - (minutes * 60)

    if (hours < 10) {
        hours = "0" + hours
    }
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    return hours + ':' + minutes + ':' + seconds
}