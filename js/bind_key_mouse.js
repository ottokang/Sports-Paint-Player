"use strict"

// 綁定鍵盤、滑鼠動作
$("body").on("keydown", (function(keyEvent) {
    switch (keyEvent.code) {
        case "Digit1": // 1：畫筆
            if ($("#pen_type").val() != "1") {
                $("#pen_type").val(1).change()
                showOSD("切換為畫筆", "center", "increase")
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

        case "KeyX": // X：恢復播放速度
            setPlaybackRate("100")
            break

        case "KeyZ": // Z：快速倒轉
            fastReversePlay(parseInt($("#jump_second").val()))
            break

        case "KeyC": // C：清空畫布
            clearCanvas()
            break
    }
}))

// 綁定滑鼠滾輪調整 input 數值、select 選項，並且限制數值上下限
$("#control > .item").on("wheel", function(wheelEvent) {
    if (wheelEvent.originalEvent.deltaY < 0) {
        // 滾輪往上：增加數值
        $(this).children("input[type='number']").val(parseInt($(this).children("input[type='number']").val()) + 1).trigger("change")
        $(this).find("select option:selected").removeAttr("selected").prev().prop("selected", "selected").trigger("change")
    } else {
        // 滾輪往下：減少數值
        $(this).children("input[type='number']").val(parseInt($(this).children("input[type='number']").val()) - 1).trigger("change")
        $(this).find("select option:selected").removeAttr("selected").next().prop("selected", "selected").trigger("change")
    }
})

$("input[type='number']").on("change", function(wheelEvent) {
    if ($(this).attr("max") != undefined && parseInt($(this).val()) > parseInt($(this).attr("max"))) {
        $(this).val($(this).attr("max"))
    }
    if ($(this).attr("min") != undefined && parseInt($(this).val()) < parseInt($(this).attr("min"))) {
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