"use strict"

$(function() {
    // 綁定按鍵動作
    $("body").keydown(function(keyEvent) {
        switch (keyEvent.code) {
            case "Digit1": // 1：畫筆
                $("#pen_type").val(1).change()
                showOsd("切換為畫筆", "center", "increase")
                break

            case "Digit2": // 2：拖曳遮罩
                $("#pen_type").val(2).change()
                showOsd("切換為遮罩", "center", "increase")
                break

            case "Backquote": // `：展開/收起操作按鈕
                $("#control_buttons").toggle(300)
                break

            case "Space": // Space：暫停/播放
                playPause()
                break

            case "KeyA": // A：倒退
                jump(0 - parseInt($("#jump_second").val()))
                break

            case "KeyD": // D：快進
                jump(parseInt($("#jump_second").val()))
                break

            case "KeyE": // E：倒退0.2秒
                jump(0.2)
                break

            case "KeyQ": // Q：倒退0.2秒
                jump(-0.2)
                break

            case "KeyW": // W：加速20%
                speed(20.0)
                break

            case "KeyS": // S：減速20%
                speed(-20.0)
                break

            case "KeyX": // X：恢復播放速度
                speed("100")
                break

            case "KeyZ": // Z：快速倒轉
                fastReversePlay(parseInt($("#jump_second").val()))
                break

            case "KeyC": // C：清空畫布
                clearCanvas()
                break
        }
    })

    // 綁定滑鼠滾輪動作
    $("body").on("wheel", function(wheelEvent) {
        if (wheelEvent.originalEvent.deltaY < 0) {
            // 滾輪往上：放大影像
            zoomIn()
        } else {
            // 滾輪往下：還原影像大小
            zoomDefault()
        }
    })
})