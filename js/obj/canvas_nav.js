"use strict"

var canvasNav = {
    // 顯示訊息
    showMessage(message, countDown = 2) {
        $("#message").html(message).show()
        let messageInterval = setInterval(function() {
            $("#message").hide("slow")
            clearInterval(messageInterval)
        }, countDown * 1000)
    },

    // 顯示影片 OSD 訊息
    showOSD(message, position = "center", fadeOutEffect = "increase", fadeOutSeconds = 1.2) {
        $("#video_osd").finish().removeAttr("style") //清除之前的效果，讓 OSD 可以再次顯示
        $("#video_osd").html(message).show()
        $("#video_osd").attr("class", `osd_${position}`)
        // OSD 訊息置中（使用 transform -50％會影響動畫效果）
        $("#video_osd").css("margin-left", -($("#video_osd").width() / 2))
        $("#video_osd").css("margin-top", -($("#video_osd").height() / 2))

        switch (fadeOutEffect) {
            case "increase":
                $("#video_osd").css("transform", "scale(1.3)")
                break
            case "decrease":
                $("#video_osd").css("transform", "scale(0.7)")
                break
            case "right":
                $("#video_osd").css("transform", "translate(1.2em)")
                break
            case "left":
                $("#video_osd").css("transform", "translate(-1.2em)")
                break
            case "none":
                break
        }

        if (fadeOutSeconds !== 0) {
            $("#video_osd").animate({
                opacity: "0"
            }, fadeOutSeconds * 1000, function() {
                $(this).hide()
            })
        }
    },

    // 清空畫布
    clearCanvas(isShowOsd = true, isReset = false) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        if (isShowOsd) {
            this.showOSD("清空畫布", "center", "increase")
        }

        // 設定繪圖物件為初始狀態
        if (isReset === true) {
            Object.keys(drawObj).forEach(key => {
                if (drawObj[key].hasOwnProperty("reset")) {
                    drawObj[key].reset()
                }
            })
        }
    },

    // 設定畫筆物件選單
    setupDrawObj() {
        $(".draw_property_block").hide()
        $("#draw_property #pen_type_" + $("#pen_type").val()).show()
        drawObj[$("#pen_type").val()].setup()
    },

    // 初始化繪圖UI
    initDrawUI() {
        // 依照畫筆物件設定，加入畫筆顏色選項
        $("#pen_color").html("")
        $.each(pen.colors, function(colorName, value) {
            $("#pen_color").append(`<option value="${value}" style="color:${value};">${colorName}</option>`)
        })
        $("#pen_color").css("color", $("#pen_color").val())

        // 依照多邊形物件設定，加入多邊形顏色選項
        $("#polygon_color").html("")
        $.each(polygon.colors, function(colorName, value) {
            $("#polygon_color").append(`<option value="${value}" style="color:${value};">${colorName}</option>`)
        })
        $("#polygon_color").css("color", $("#polygon_color").val())

        // 綁定熱鍵說明按鈕
        $("#hotkey_toggle_button").on("click", function() {
            canvasNav.toggleHotkeyButton()
        })

        // 綁定觸發標記屬性按鈕
        $("#draw_property_toggle_button").on("click", function() {
            canvasNav.toggleDrawPropertyButton()
        })

        // 綁定設定標記屬性後，轉移焦點到影片上，避免空白鍵再度觸發選項
        $("#control option, #draw_property option").on("click", function() {
            $("#video_content").focus()
        })
    },

    // 觸發說明按鈕
    toggleHotkeyButton() {
        $("#hotkey_toggle_button").toggleClass("button_pressed")
        console.log("11")
        if ($("#hotkey_toggle_button").hasClass("button_pressed")) {
            $("#hotkey_toggle_button_text").html("隱藏操作按鍵")
        } else {
            $("#hotkey_toggle_button_text").html("顯示操作按鍵")
        }
        $("#hotkey_buttons").toggleClass("show_hotkeys")
    },

    // 觸發繪圖屬性按鈕
    toggleDrawPropertyButton() {
        $("#draw_property_toggle_button").toggleClass("button_pressed")
        if ($("#draw_property_toggle_button").hasClass("button_pressed")) {
            $("#draw_property_button_text").html("隱藏標記屬性")
        } else {
            $("#draw_property_button_text").html("顯示標記屬性")
        }
        $("#draw_property").toggleClass("show_draw_property")
    }
}