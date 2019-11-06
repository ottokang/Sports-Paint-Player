"use strict"

$(function() {
    // 綁定按鍵動作
    $("body").keydown(function(keyEvent) {
        if (keyEvent.shiftKey) {
            switch (keyEvent.code) {
                // Shift + A：快速倒轉5秒
                case "KeyA":
                    fastReversePlay(5)
                    break
            }
        } else {
            switch (keyEvent.code) {
                case "Backquote": // `：展開/收起操作按鈕
                    $("#control_buttons").toggle(300)
                    break

                case "Space": // Space：暫停/播放
                    playPause()
                    break

                case "KeyA": // A：倒退5秒
                    jump(-5)
                    break

                case "KeyD": // D：快進5秒
                    jump(5)
                    break

                case "KeyE": // E：倒退0.1秒
                    jump(0.1)
                    break

                case "KeyQ": // Q：倒退0.1秒
                    jump(-0.1)
                    break

                case "KeyW": // W：加速20%
                    speed(20)
                    break

                case "KeyS": // S：減速20%
                    speed(-20)
                    break

                case "KeyZ": // Z：恢復播放速度
                    speed("100")
                    break

                case "KeyC": // C：清空畫布
                    clearCanvas()
                    break
            }
        }
    })

    // 綁定滑鼠滾輪動作
    $("body").on("wheel", function(wheelEvent) {
        if (wheelEvent.originalEvent.deltaY < 0) {
            zoomIn()
        } else {
            zoomDefault()
        }
    })
})