"use strict"

// 綁定鍵盤、滑鼠動作
$("body").on("keydown", (function(keyEvent) {
    if (isInputComment === false) {
        switch (keyEvent.code) {
            case "Digit1": // 1：畫筆
                if ($("#pen_type").val() != "1") {
                    $("#pen_type").val(1).change()
                    showOSD("切換為畫筆", "center", "increase")
                }
                break

            case "Digit2": // 2：遮罩
                if ($("#pen_type").val() != "2") {
                    $("#pen_type").val(2).change()
                    showOSD("切換為遮罩", "center", "increase")
                }
                break

            case "Digit3": // 3：路徑遮罩
                if ($("#pen_type").val() != "3") {
                    $("#pen_type").val(3).change()
                    showOSD("切換為路徑遮罩", "center", "increase")
                }
                break

            case "Backquote": // `：展開/收起操作按鈕
                if ($("#hotkey_buttons").css("display") === "none") {
                    $("#toggle_button #toggle_button_text").html("隱藏操作按鍵").parent().addClass("button_pressed")
                } else {
                    $("#toggle_button #toggle_button_text").html("顯示操作按鍵").parent().removeClass("button_pressed")
                }
                $("#hotkey_buttons").toggle(300)
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
                setPlaybackRate(20)
                break

            case "KeyS": // S：減速20%
                setPlaybackRate(-20)
                break

            case "KeyZ": // Z：恢復播放速度、Shift + Z 顯示/隱藏註解列表
                if (keyEvent.shiftKey) {
                    toggleCommentLsit()
                } else {
                    setPlaybackRate("100")
                }
                break

            case "KeyX": // X：回到回播點、Shift + X 設定回播點
                if (keyEvent.shiftKey) {
                    setBackTime()
                } else {
                    toBackTime()
                }
                break

            case "KeyC": // C：清空畫布、Shift + C 清除回播點
                if (keyEvent.shiftKey) {
                    clearBackTime()
                } else {
                    clearCanvas()
                }
                break
        }
    }
}))

// 綁定滑鼠滾輪調整 input 數值、select 選項
$("#control > .item").on("wheel", function(wheelEvent) {
    if ($(this).children("input[type='number']").length != 0) {
        let inputNumber = $(this).children("input[type='number']")
        let step = parseFloat(inputNumber.attr("step"))
        let numberValue = parseFloat(inputNumber.val())
        let stepNumber = Number(inputNumber.attr("step"))
        let fixCount
        if (Number.isInteger(stepNumber)) {
            fixCount = 0
        } else {
            fixCount = inputNumber.attr("step").split(".")[1].length
        }

        if (wheelEvent.originalEvent.deltaY < 0) {
            // 滾輪往上：增加數值
            inputNumber.val((numberValue + step).toFixed(fixCount)).trigger("change")
        } else {
            // 滾輪往下：減少數值
            inputNumber.val((numberValue - step).toFixed(fixCount)).trigger("change")
        }
    }

    if (wheelEvent.originalEvent.deltaY < 0) {
        // 滾輪往上：往上移動選項
        $(this).find("select option:selected").removeAttr("selected").prev().prop("selected", "selected").trigger("change")
    } else {
        // 滾輪往下：往下移動選項
        $(this).find("select option:selected").removeAttr("selected").next().prop("selected", "selected").trigger("change")
    }
})

// 限制 input 數值上下限
$("input[type='number']").on("change", function(wheelEvent) {
    if ($(this).attr("max") != undefined && parseFloat($(this).val()) > parseFloat($(this).attr("max"))) {
        $(this).val($(this).attr("max"))
    }
    if ($(this).attr("min") != undefined && parseFloat($(this).val()) < parseFloat($(this).attr("min"))) {
        $(this).val($(this).attr("min"))
    }
})

// 綁定影片播放滑鼠滾輪動作
$("#canvas_area").on("wheel", function(wheelEvent) {
    if (wheelEvent.originalEvent.deltaY < 0) {
        // 滾輪往上：放大影像
        zoomIn()
    } else {
        // 滾輪往下：還原影像大小
        zoomDefault()
    }
})