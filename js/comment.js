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
            appendCommentItem(i, commentListJson[i])
        }
        $("#select_comment_button").hide()
        $("#comment_source").show()
        commentList.show()
        canvasNav.showMessage("讀取註解完成", 1)
    }

    // 讀取註解檔
    commentFileReader.readAsText(commentFile)
})


// 綁定點選顯示新增註解對話框動作
$("#add_comment").on("click", function() {
    showCommentDialog("add")
})

// 綁定註解對話框可以拖曳
commentList.setCommentDialogDraggable()

// 綁定點選關閉註解對話框動作
$("#close_comment_dialog").on("click", function() {
    closeCommentDialog()
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
    if (validateCommentDialog()) {
        let comment = loadCommentDialogToJson()
        // 設定新註解的ID
        let id
        if ($("#comment_list > div:last").length === 0) {
            id = 0
        } else {
            id = Number($("#comment_list > div:last").attr("id").replace("comment_item_", "")) + 1
        }
        appendCommentItem(id, comment)
        canvasNav.showMessage("新增註解成功")
        commentList.show()
        closeCommentDialog(false)
    }
})

// 綁定點選註解更新提交按鈕動作
$("#update_comment_submit").on("click", function() {
    if (validateCommentDialog()) {
        let id = $("#update_comment_dialog_title").data("id")
        let comment = loadCommentDialogToJson()
        commentItem.saveJson(id, comment)
        $(`#comment_item_${id} .comment_title_text`).html(comment.title)
        $(`#comment_item_${id} .comment_title_time_HHMMSS`).html(comment.time.toString().toHHMMSS())
        canvasNav.showMessage("更新註解成功")
        closeCommentDialog(false)
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

// 顯示註解對話框
function showCommentDialog(type) {
    isInputComment = true
    video.pause()
    $("#comment_dialog").show()
    $("#comment_title_input").focus()
    $("#comment_dialog").css({
        top: "25%",
        left: "40%"
    })
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
}


// 關閉註解對話框
function closeCommentDialog(isConfirm = true) {
    if (isConfirm === true) {
        if (confirm("確定關閉註解？")) {
            $("#comment_dialog").hide()
            isInputComment = false
        }
    } else {
        $("#comment_dialog").hide()
        isInputComment = false
    }
}

// 驗證輸入資料
function validateCommentDialog() {
    // 清除空白
    $("#comment_title_input").val($("#comment_title_input").val().trim())
    $("#comment_text_input").val($("#comment_text_input").val().trim())

    if ($("#comment_title_input").val() == "") {
        alert("請輸入註解標題")
        $("#comment_title_input").select()
        return false
    }

    if ($("#comment_text_input").val() == "") {
        alert("請輸入註解內容")
        $("#comment_text_input").select()
        return false
    }

    return true
}

// 附加註解項目到註解列表
function appendCommentItem(id, comment) {
    $("#comment_list").append(
        `<div id="comment_item_${id}" class="comment_item">
            <div class="delete_comment" data-comment_id="${id}">刪除</div>
            <div class="edit_comment" data-comment_id="${id}">編輯</div>
            <div class="comment_title" title="${comment.title}\n${comment.text}">
                <span class="comment_title_time_HHMMSS">${comment.time.toString().toHHMMSS()}</span>
                <span class="comment_title_text" >${comment.title}</span>
            </div>
        </div>`
    )
    commentItem.saveJson(id, comment)

    // 綁定點選跳到註解時間點，顯示註解文字
    $(`#comment_item_${id} .comment_title`).on("click", function() {
        $(".current_comment_item").removeClass("current_comment_item")
        $(this).addClass("current_comment_item")
        commentItem.showText(id)
        video.play()
    })

    // 綁定點選顯示編輯註解對話框
    $(`#comment_item_${id} .edit_comment`).on("click", function() {
        let id = $(this).parent().attr("id").replace("comment_item_", "")
        let comment = commentItem.loadJson(id)
        $("#update_comment_dialog_title").data("id", id)
        video.currentTime = comment.time
        loadJsonToCommentDialog(comment)
        showCommentDialog("edit")
    })

    // 綁定點選刪除註解
    $(`#comment_item_${id} .delete_comment`).on("click", function() {
        if (confirm("確認刪除此註解？")) {
            $(this).parent().remove()
            if ($("#comment_list").children().length === 0) {
                commentList.hide()
            }
        }
    })
}

// 讀取對話框內容為JSON物件
function loadCommentDialogToJson() {
    let comment = {}
    comment.time = video.currentTime
    comment.title = $("#comment_title_input").val()
    comment.position = $('input[name="comment_text_position"]:checked').val()
    comment.text = $("#comment_text_input").val()
    comment.duration = Number($("#comment_duration_input").val())
    return comment
}

// 讀取JSON到註解對話框
function loadJsonToCommentDialog(comment) {
    $("#comment_time_HHMMSS").val(comment.time.toString().toHHMMSS())
    $("#comment_title_input").val(comment.title)
    $(`input:radio[name="comment_text_position"][value="${comment.position}"]`).prop('checked', true)
    $("#comment_text_input").val(comment.text)
    $("#comment_duration_input").val(comment.duration)
}