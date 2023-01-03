"use strict";

// 綁定鍵盤、滑鼠動作
$("body").on("keydown", function (keyEvent) {
    if (isInputComment === false) {
        // 沒有在輸入註解的狀態
        switch (keyEvent.code) {
            case "Digit1": // 1：畫筆
                if ($("#pen_type").val() !== "1") {
                    $("#pen_type").val(1).change();
                    canvasNav.showOSD("切換為畫筆", "center", "increase");
                }
                break;

            case "Digit2": // 2：遮罩
                if ($("#pen_type").val() !== "2") {
                    $("#pen_type").val(2).change();
                    canvasNav.showOSD("切換為遮罩", "center", "increase");
                }
                break;

            case "Digit3": // 3：路徑遮罩
                if ($("#pen_type").val() !== "3") {
                    $("#pen_type").val(3).change();
                    canvasNav.showOSD("切換為路徑遮罩", "center", "increase");
                }
                break;

            case "Digit4": // 4：多邊形
                if ($("#pen_type").val() !== "4") {
                    $("#pen_type").val(4).change();
                    canvasNav.showOSD("切換為多邊形", "center", "increase");
                }
                break;

            case "Backquote": // `：展開/收起繪圖屬性
                canvasNav.toggleDrawPropertyButton();
                break;

            case "Space": // Space：暫停/播放
                keyEvent.preventDefault();
                keyEvent.stopPropagation();
                videoNav.playPause();
                break;

            case "KeyM": // M：靜音/有聲
                videoNav.toggleMute();
                break;

            case "KeyA": // A：倒退
                videoNav.jump(0 - Number($("#jump_second").val()));
                break;

            case "KeyD": // D：快進
                videoNav.jump($("#jump_second").val());
                break;

            case "KeyE": // E：倒退0.2秒
                videoNav.jump(0.2);
                break;

            case "KeyQ": // Q：倒退0.2秒
                videoNav.jump(-0.2);
                break;

            case "KeyW": // W：加速20%
                videoNav.setPlaybackRate(20);
                break;

            case "KeyS": // S：減速20%
                videoNav.setPlaybackRate(-20);
                break;

            case "KeyZ": // Z：恢復播放速度、Shift + Z 顯示/隱藏註解列表
                if (keyEvent.shiftKey) {
                    commentList.toggle();
                } else {
                    videoNav.setPlaybackRate("100");
                }
                break;

            case "KeyX": // X：移到回播點、Shift + X 設定回播點
                if (keyEvent.shiftKey) {
                    videoNav.setBackTime();
                } else {
                    videoNav.moveToBackTime();
                }
                break;

            case "KeyC": // C：清空畫布、Shift + C 清除回播點
                if (keyEvent.shiftKey) {
                    videoNav.clearBackTime();
                } else {
                    canvasNav.clearCanvas(true, true);
                }
                break;

            case "KeyF": // F：上一個註解
                commentList.prev();
                break;

            case "KeyV": // V：下一個註解
                commentList.next();
                break;

            case "KeyR": // R：重新目前載入註解
                commentList.reloadCurrent();
                break;
        }
    } else {
        // 輸入註解狀態
        switch (keyEvent.code) {
            case "Escape": // Esc：關閉註解對話框
                commentList.closeDialog();
                break;
            case "Enter": // Ctrl + Enter：送出註解對話框內容
                if (keyEvent.ctrlKey) {
                    if ($("#add_comment_submit").is(":visible")) {
                        $("#add_comment_submit").trigger("click");
                    }

                    if ($("#update_comment_submit").is(":visible")) {
                        $("#update_comment_submit").trigger("click");
                    }
                }
                break;
        }
    }
});

// 綁定滑鼠滾輪調整 input 數值、select 選項
$(".property_item, #comment_dialog > div").on("wheel", function (wheelEvent) {
    if ($(this).children("input[type='number']").length !== 0) {
        let inputTypeNumber = $(this).children("input[type='number']");
        let step = Number(inputTypeNumber.attr("step"));
        let inputTypeNumberValue = Number(inputTypeNumber.val());
        let stepFixCount;
        if (Number.isInteger(step)) {
            stepFixCount = 0;
        } else {
            stepFixCount = inputTypeNumber.attr("step").split(".")[1].length;
        }

        if (wheelEvent.originalEvent.deltaY < 0) {
            // 滾輪往上：增加數值
            inputTypeNumber.val((inputTypeNumberValue + step).toFixed(stepFixCount)).trigger("change");
        } else {
            // 滾輪往下：減少數值
            inputTypeNumber.val((inputTypeNumberValue - step).toFixed(stepFixCount)).trigger("change");
        }
    }

    if (wheelEvent.originalEvent.deltaY < 0) {
        // 滾輪往上：往上移動選項
        $(this).find("select option:selected").removeAttr("selected").prev().prop("selected", "selected").trigger("change");

        // 到達選項頂端效果
        if ($(this).find("select option:selected").prevAll().length === 0) {
            reachTopEffect($(this).find("select"));
        }
    } else {
        // 滾輪往下：往下移動選項
        $(this).find("select option:selected").removeAttr("selected").next().prop("selected", "selected").trigger("change");

        // 到達選項底部效果
        if ($(this).find("select option:selected").nextAll().length === 0) {
            reachBottomEffect($(this).find("select"));
        }
    }
});

// 限制 input 數值上下限
$("input[type='number']").on("change", function () {
    if ($(this).attr("max") !== undefined && Number($(this).val()) > Number($(this).attr("max"))) {
        $(this).val($(this).attr("max"));

        // 到達上限效果
        reachTopEffect($(this));
    }
    if ($(this).attr("min") !== undefined && Number($(this).val()) < Number($(this).attr("min"))) {
        $(this).val($(this).attr("min"));

        // 到達下限效果
        reachTopEffect($(this));
    }
});

// 綁定影片播放滑鼠滾輪動作
$("#canvas_area").on("wheel", function (wheelEvent) {
    if (wheelEvent.originalEvent.deltaY < 0) {
        // 滾輪往上：放大影像
        videoNav.zoomIn();
    } else {
        // 滾輪往下：還原影像大小
        videoNav.zoomDefault();
    }
});

// 到達上限、選項到頂部效果
function reachTopEffect(jqueryObj) {
    jqueryObj
        .stop(true, true)
        .css({
            fontWeight: "normal",
        })
        .animate(
            {
                "font-weight": "+=300",
            },
            200
        )
        .animate(
            {
                "font-weight": "-=300",
            },
            200
        );
}

// 到達下限、選項到底部效果
function reachBottomEffect(jqueryObj) {
    jqueryObj
        .stop(true, true)
        .css({
            fontWeight: "normal",
        })
        .animate(
            {
                "font-weight": "+=300",
            },
            200
        )
        .animate(
            {
                "font-weight": "-=300",
            },
            200
        );
}
