"use strict"

var canvasNav = {
    // 顯示訊息
    showMessage(message, countDown = 2) {
        $("#message").html(message).show()
        var messageInterval = setInterval(function() {
            $("#message").hide("slow")
            clearInterval(messageInterval)
        }, countDown * 1000)
    },

    // 顯示影片 OSD 訊息
    showOSD(text, position = "center", fadeOut = "increase", fadeOutTime = 1000) {
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
    },
    // 清空畫布
    clearCanvas(isShowOsd = true) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        if (isShowOsd) {
            this.showOSD("清空畫布", "center", "increase")
        }
    },

    // 設定畫筆物件選單
    setupDrawObj() {
        $("[class*='pen_type_id_']").hide()
        $(".pen_type_id_" + $("#pen_type").val()).show()
        drawObj[parseInt($("#pen_type").val())].setup()
    },

    // 初始化畫筆UI
    initDrawUI() {
        // 依照畫筆物件設定，加入畫筆顏色選項，設定畫筆顏色
        $.each(pen.colors, function(colorName, value) {
            var optionElement = document.createElement("option")
            optionElement.setAttribute("value", value)
            optionElement.style.color = value
            optionElement.innerHTML = colorName
            $("#pen_color").append(optionElement)
        })
        $("#pen_color").css("color", $("#pen_color").val())
        $("#control").show()
    },

    // 建立測試 canvas
    createTestCanvas() {
        $("#canvas_area").show()
        $("#canvas_area").css("border", "2px solid grey")
        $("#canvas_area").css("margin-top", "4em")
        $("#video_content").css("top", "4em")
        ctx.canvas.width = $(window).width() * 0.8
        ctx.canvas.height = $(window).height() * 0.8
        $("#container").css("position", "inherit")
        $("#select_video_button").hide()
        this.initDrawUI()
        this.setupDrawObj()
    }
}