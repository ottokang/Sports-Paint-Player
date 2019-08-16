"use strict"

$(function () {
    // 綁定按鍵動作
    $("body").keydown(function (keyEvent) {
        switch (keyEvent.which) {
            case 192: // `：展開/收起操作按鈕
                $("#control_buttons").toggle(300)
                break

            case 32: // Space：暫停/播放
                playPause()
                break

            case 65: // A：倒轉5秒
                forwardBackward(-5)
                break

            case 68: // D：快轉5秒
                forwardBackward(5)
                break

            case 69: // E：快轉0.1秒
                forwardBackward(0.1)
                break

            case 81: // Q：倒轉0.1秒
                forwardBackward(-0.1)
                break

            case 87: // W：加速10%
                speedUpDown(10)
                break

            case 83: // S：減速10%
                speedUpDown(-10)
                break

            case 90: // Z：恢復播放速度
                speedUpDown("100")
                break

            case 88: // X：放大/復原影像
                resize()
                break

            case 67: // C：清空畫布
                clearCanvas()
                break
        }
    })
})