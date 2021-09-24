"use strict"

var videoNav = {
    playPause() {
        if (video.paused) {
            video.play()
            canvasNav.showOSD("繼續", "center", "increase")
        } else {
            video.pause()
            canvasNav.showOSD("暫停", "center", "increase")
        }
    },

    // 跳躍秒數設定
    jump(seconds) {
        if (typeof seconds === "string") {
            seconds = Number(seconds)
        }
        video.currentTime = video.currentTime + seconds
        if (seconds > 0) {
            canvasNav.showOSD(`+${seconds}秒`, "right", "right")
        } else {
            canvasNav.showOSD(`${seconds}秒`, "left", "left")
        }
    },

    // 設定播放速度
    setPlaybackRate(percentage) {
        if (percentage == "100") {
            video.playbackRate = 1.0
            canvasNav.showOSD("恢復播放速度", "center", "none")
        } else if (percentage > 0 && video.playbackRate < 2) {
            video.playbackRate = Number(video.playbackRate + percentage / 100).toFixed(2)
            canvasNav.showOSD(`播放速度+${percentage}%`, "center", "increase")
        } else if (percentage < 0 && video.playbackRate > 0.3) {
            video.playbackRate = Number(video.playbackRate + percentage / 100).toFixed(2)
            canvasNav.showOSD(`播放速度${percentage}%`, "center", "decrease")
        }
        $("#playback_speed").html(Math.floor(video.playbackRate * 100))
    },

    // 設定影片回播點
    setBackTime() {
        let progressRadio = video.currentTime / video.duration
        $("#back_time_pointer").css("margin-left", `${progressRadio * 100}%`)
        $("#back_time_pointer").attr("data-back_time", video.currentTime.toString())
        $("#back_time_pointer").show()
        canvasNav.showOSD(`設定回播點：${video.currentTime.toString().toHHMMSS()}`)
    },

    // 清除影片回播點
    clearBackTime() {
        if ($("#back_time_pointer").is(":visible")) {
            $("#back_time_pointer").hide()
            canvasNav.showOSD("清除回播點")
        }
    },

    // 回到影片回播點
    toBackTime() {
        if ($("#back_time_pointer").is(":visible")) {
            video.currentTime = $("#back_time_pointer").attr("data-back_time")
            canvasNav.showOSD(`回到回播點：${video.currentTime.toString().toHHMMSS()}`)
        } else {
            canvasNav.showMessage("請先設定回播點", 3)
        }
    },

    // 放大影像
    zoomIn() {
        if (!isResized) {
            $("#video_content").css("transform-origin", resizeXOffset + "% " + resizeYOffset + "%")
            $("#video_content").css("transform", "scale(" + $("#resize_radio").val() + ")")
            $("#video_size_info").html("放大" + $("#resize_radio").val() + "倍")
            $("#video_size_info").css("color", "red")
            $("#video_size_info").css("font-size", "130%")
            canvasNav.showOSD("放大" + $("#resize_radio").val() + "倍", "center", "increase")
            isResized = true
        }
    },

    // 還原影像大小
    zoomDefault() {
        if (isResized) {
            $("#video_content").css("transform", "scale(1)")
            $("#video_size_info").html("標準畫面大小")
            $("#video_size_info").css("color", "#ffffff")
            $("#video_size_info").css("font-size", "100%")
            canvasNav.showOSD("標準畫面大小", "center", "decrease")
            isResized = false
        }
    },

    // 設定靜音
    setMute() {
        $("#video_muted_info").html("影片靜音🔇")
        video.volume = 0
        canvasNav.showOSD("影片靜音", "center", "none", 2)
    },

    // 取消靜音
    cancelMute() {
        $("#video_muted_info").html("影片有聲🔊")
        video.volume = 1
        canvasNav.showOSD("影片有聲", "center", "none", 2)
    },

    // 觸動靜音
    toggleMute() {
        if (video.volume === 1) {
            this.setMute()
        } else {
            this.cancelMute()
        }
    }
}