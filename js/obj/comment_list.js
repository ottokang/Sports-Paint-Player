"use strict"

var commentList = {
    // 顯示註解列表
    show() {
        if ($("#comment_list").children().length > 0) {
            $("#comment").show(100).addClass("comment_show")
            $("#toggle_comment_list").removeClass("toggle_comment_show")
            $("#toggle_comment_list").addClass("toggle_comment_hide")
            $("#toggle_comment_list").html("隱藏註解列表←")
        } else {
            canvasNav.showMessage("目前沒有註解可以顯示", 3)
        }
    },

    // 隱藏註解列表
    hide() {
        $("#comment").removeClass("comment_show")
        $("#toggle_comment_list").removeClass("toggle_comment_hide")
        $("#toggle_comment_list").addClass("toggle_comment_show")
        $("#toggle_comment_list").html("顯示註解列表→")
    },

    // 觸動註解列表
    toggle() {
        if ($("#comment").hasClass("comment_show")) {
            this.hide()
        } else {
            this.show()
        }
    },

    // 移到下一個註解
    next() {
        if ($("#comment_list").children().length === 0) {
            canvasNav.showMessage("目前沒有註解可以顯示", 2)
            return
        }

        // 如果都沒有選取，從第一個開始
        if ($(".current_comment_item").length === 0) {
            $(".comment_title:first").addClass("current_comment_item")
        } else {
            // 選取下一個註解
            if ($(".current_comment_item").parent().next().length === 0) {
                canvasNav.showMessage("已經到最後一個註解", 2)
                return
            } else {
                let currentCommentItem = $(".current_comment_item")
                $(".current_comment_item").parent().next().children(".comment_title").addClass("current_comment_item")
                currentCommentItem.removeClass("current_comment_item")
                canvasNav.showOSD("下一個註解", "center", "decrease")
            }
        }

        $(".current_comment_item")[0].click()
    },

    // 移到上一個註解
    prev() {
        if ($("#comment_list").children().length === 0) {
            canvasNav.showMessage("目前沒有註解可以顯示", 2)
            return
        }

        // 如果都沒有選取，從最後一個開始
        if ($(".current_comment_item").length === 0) {
            $(".comment_title:last").addClass("current_comment_item")
        } else {
            // 選取上一個註解
            if ($(".current_comment_item").parent().prev().length === 0) {
                canvasNav.showMessage("已經到第一個註解", 2)
                return
            } else {
                let currentCommentItem = $(".current_comment_item")
                $(".current_comment_item").parent().prev().children(".comment_title").addClass("current_comment_item")
                currentCommentItem.removeClass("current_comment_item")
                canvasNav.showOSD("上一個註解", "center", "increase")
            }
        }

        $(".current_comment_item")[0].click()
    },

    // 重新載入目前註解
    reloadCurrent() {
        if ($("#comment_list").children().length === 0) {
            canvasNav.showMessage("目前沒有註解可以顯示", 2)
            return
        } else {
            if ($(".current_comment_item").length == 0) {
                canvasNav.showMessage("請先點選註解", 2)
            } else {
                $(".current_comment_item")[0].click()
            }
        }
    },

    // 顯示註解對話框
    showDialog(type) {
        isInputComment = true
        video.pause()
        $("#comment_dialog").show()
        $("#comment_title_input").focus()

        if (type === "add") {
            // 清除註解對話框內容、建立預設值
            $("#comment_time_HHMMSS").val(video.currentTime.toString().toHHMMSS())
            $("#comment_title_input, #comment_text_input").val("")
            $("#comment_duration_input").val("10")
            $("#comment_position_center").prop("checked", "checked")
            $(".new_comment").show()
            $(".update_comment").hide()
        } else if (type === "edit") {
            $(".new_comment").hide()
            $(".update_comment").show()
        }
    },

    // 關閉註解對話框
    closeDialog(isConfirm = true) {
        if (isConfirm === true) {
            if (confirm("確定關閉註解編輯對話框？")) {
                $("#comment_dialog").hide()
                isInputComment = false
            }
        } else {
            $("#comment_dialog").hide()
            isInputComment = false
        }
    },

    // 驗證輸入資料
    validateDialog() {
        // 清除輸入前後空白
        $("#comment_title_input").val($("#comment_title_input").val().trim())
        $("#comment_text_input").val($("#comment_text_input").val().trim())

        if ($("#comment_title_input").val() == "") {
            this.notifyInput("#comment_title_input")
            $("#comment_title_input").select()
            return false
        }

        if ($("#comment_text_input").val() == "") {
            this.notifyInput("#comment_text_input")
            $("#comment_text_input").select()
            return false
        }

        return true
    },

    // 附加註解項目到註解列表
    appendItem(id, comment) {
        $("#comment_list").append(
            `<div id="comment_item_${id}" class="comment_item" data-comment_id="${id}">
            <div class="delete_comment">刪除</div>
            <div class="edit_comment">編輯</div>
            <div class="comment_title" title="${comment.title}\n${comment.text}">
                <span class="comment_title_time_HHMMSS">${comment.time.toString().toHHMMSS()}</span>
                <span class="comment_title_text" >${comment.title}</span>
            </div>
        </div>`
        )
        commentItem.saveJson(id, comment)
    },

    // 讀取對話框內容為JSON物件
    loadDialog() {
        let comment = {}
        comment.time = video.currentTime
        comment.title = $("#comment_title_input").val()
        comment.position = $('input[name="comment_text_position"]:checked').val()
        comment.text = $("#comment_text_input").val()
        comment.duration = Number($("#comment_duration_input").val())
        return comment
    },

    // 設定註解對話框內容
    setDialog(comment) {
        $("#comment_time_HHMMSS").val(comment.time.toString().toHHMMSS())
        $("#comment_title_input").val(comment.title)
        $(`input:radio[name="comment_text_position"][value="${comment.position}"]`).prop('checked', true)
        $("#comment_text_input").val(comment.text)
        $("#comment_duration_input").val(comment.duration)
    },

    // 重置註解列表
    reset() {
        $("#comment, #comment_source").hide()
        $("#comment_source").val("")
    },

    // 提示輸入區
    notifyInput(domId) {
        for (let i = 0; i < 2; i++) {
            $(domId).fadeOut(350)
            $(domId).fadeIn(350)
        }
    }
}