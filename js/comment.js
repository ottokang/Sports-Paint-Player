"use strict"

// 設定是否正在輸入註解，暫停熱鍵用
var isInputComment = false

// 清除註解檔案名稱（設定下載檔名）
$("#comment_source").val("")

// 綁定註解檔案上傳動作
$("#comment_source").on("change", function() {
    let commentFile = this.files[0]
    let commentFileReader = new FileReader()

    // 綁定註解檔案讀取動作
    commentFileReader.onload = function(event) {
        // 檢查是否為正確的 JSON 檔案
        let commentListJson
        try {
            commentListJson = JSON.parse(this.result)
        } catch (e) {
            canvasNav.showMessage(`上傳的註解檔案"${commentFile.name}"有錯誤，無法解析內容`, 6)
            return
        }

        // 讀取註解檔案到註解列表
        $("#comment_list").empty()
        for (let i = 0; i < commentListJson.length; i++) {
            commentList.appendItem(i, commentListJson[i])
        }
        $("#select_comment_button").hide()
        $("#comment_source, #comment").show()

        commentList.show()
        canvasNav.showMessage("讀取註解完成", 1)
    }

    // 讀取註解檔
    commentFileReader.readAsText(commentFile)
})

// 綁定點選顯示新增註解對話框動作
$("#add_comment").on("click", function() {
    commentList.showDialog("add")
})

// 綁定點選關閉註解對話框動作
$("#close_comment_dialog").on("click", function() {
    commentList.closeDialog()
})

// 綁定註解點選動作，委派不同任務
$("#comment_list").on("click", function(e) {
    let targetObj = $(e.target)
    let targetCommentTitle
    let commentId

    // 綁定點選跳到註解時間點，顯示註解文字
    if (targetObj.is(".comment_title_text, .comment_title_time_HHMMSS ,.comment_title")) {
        if (targetObj.is(".comment_title_text, .comment_title_time_HHMMSS")) {
            commentId = targetObj.parent().parent().data("comment_id")
            targetCommentTitle = targetObj.parent()
        } else if (targetObj.is(".comment_title")) {
            commentId = targetObj.parent().data("comment_id")
            targetCommentTitle = targetObj
        }

        $(".current_comment_item").removeClass("current_comment_item")
        targetCommentTitle.addClass("current_comment_item")
        commentItem.showText(commentId)
        video.play()
    }

    // 綁定點選顯示編輯註解對話框
    if (targetObj.is(".edit_comment")) {
        targetObj.addClass("edit_comment_editing")
        commentId = targetObj.parent().data("comment_id")
        let comment = commentItem.loadJson(commentId)
        $("#update_comment_dialog_title").data("id", commentId)
        video.currentTime = comment.time
        commentList.setDialog(comment)
        commentList.showDialog("edit")
    }

    // 綁定點選刪除註解
    if (targetObj.is(".delete_comment")) {
        if (confirm("確認刪除此註解？")) {
            targetObj.parent().remove()
            if ($("#comment_list").children().length === 0) {
                commentList.hide()
                $("#comment").hide(500)
            }
        }
    }
})

// 綁定註解輸入欄位焦點標示
$("#comment_dialog input[type*='text'], #comment_dialog textarea").on("focus", function() {
    $(this).addClass("comment_input_focus")
})
$("#comment_dialog input[type*='text'], #comment_dialog textarea").on("blur", function() {
    $(this).removeClass("comment_input_focus")
})

// 綁定點選新增註解提交按鈕動作
$("#add_comment_submit").on("click", function() {
    if (commentList.validateDialog()) {
        let comment = commentList.loadDialog()
        // 設定新註解的ID
        let id
        if ($("#comment_list > div:last").length === 0) {
            id = 0
        } else {
            id = Number($("#comment_list > div:last").attr("id").replace("comment_item_", "")) + 1
        }
        commentList.appendItem(id, comment)
        canvasNav.showMessage("新增註解成功")
        commentList.show()
        commentList.closeDialog(false)
    }
})

// 綁定點選註解更新提交按鈕動作
$("#update_comment_submit").on("click", function() {
    if (commentList.validateDialog()) {
        let id = $("#update_comment_dialog_title").data("id")
        let comment = commentList.loadDialog()
        commentItem.saveJson(id, comment)
        $(`#comment_item_${id} .comment_title_text`).html(comment.title)
        $(`#comment_item_${id} .comment_title`).prop("title", comment.text)
        $(`#comment_item_${id} .comment_title_time_HHMMSS`).html(comment.time.toString().toHHMMSS())
        canvasNav.showMessage("更新註解成功")
        commentList.closeDialog(false)
    }
})

// 綁定點選下載註解動作
$("#download_comment").on("click", function() {
    let comment = []
    $(".comment_item").each(function(i) {
        comment.push(JSON.parse($(this).data("comment")))
    })

    // 按照時間排序註解
    comment = comment.sort((a, b) => a.time - b.time)
    let jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(comment))
    let commentFileName = "註解.json"
    if ($("#comment_source").val() !== "") {
        commentFileName = $("#comment_source")[0].files[0].name
    }
    $(this).append(`<a id="download_comment_link" href="${jsonString}" download="${commentFileName}"></a>`)
    $("#download_comment_link")[0].click()
    $("#download_comment_link").remove()
})

// 綁定觸動註解顯示按鈕
$("#toggle_comment_list").on("click", function() {
    commentList.toggle()
})