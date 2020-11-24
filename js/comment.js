"use strict"

// 設定是否正在輸入註解，暫停熱鍵用
var isInputComment = false

// 綁定註解檔案上傳動作
$("#comment_source").on("change", function() {
    let commentFile = this.files[0]
    let commentReader = new FileReader()

    // 設定讀取註解動作
    commentReader.onload = function(event) {
        // 檢查是否為正確的 JSON 檔案
        try {
            var commentList = JSON.parse(this.result)
        } catch (e) {
            showMessage(`上傳的註解檔案"${commentFile.name}"有錯誤，無法解析內容`, 6)
            return
        }

        // 讀取註解檔案到註解列表
        $("#comment_list").empty()
        for (let i = 0; i < commentList.length; i++) {
            appendCommentItem(i, commentList[i])
        }
        $("#select_comment_button").hide()
        $("#comment_source").show()
        showCommentList()
        showMessage("讀取註解完成", 1)
    }

    // 讀取註解檔
    commentReader.readAsText(commentFile)
})

// 綁定點選關閉註解對話框
$("#close_comment_dialog").on("click", function() {
    closeCommentDialog()
})

// 綁定點選顯示新增註解對話框
$("#add_comment").on("click", function() {
    isInputComment = true
    video.pause()
    // 清除註解對話框內容、建立預設值
    $("#comment_time_HHMMSS").html("")
    $("#comment_title_input, #comment_text_input").val("")
    $("#comment_duration_input").val("10")

    // 顯示新增註解對話框
    $("#comment_time_HHMMSS").html(video.currentTime.toString().toHHMMSS())
    $("#comment_dialog").show()
    $(".new_comment").show()
    $(".update_comment").hide()
    $("#comment_position_center").prop("checked", "checked")
})

// 綁定點選新增註解提交按鈕動作
$("#add_comment_submit").on("click", function() {
    let comment = loadCommentDialogToJson()
    // 設定新註解的ID
    let id
    if ($("#comment_list > div:last").length === 0) {
        id = 0
    } else {
        id = (parseInt($("#comment_list > div:last").attr("id").replace("comment_item_", "")) + 1).toString()
    }
    appendCommentItem(id, comment)
    showMessage("新增註解成功")
    closeCommentDialog(false)
})

// 綁定點選註解更新提交按鈕動作
$("#update_comment_submit").on("click", function() {
    let id = parseInt($("#update_comment_dialog_title").data("id"))
    let comment = loadCommentDialogToJson()
    saveCommentJson(id, comment)
    $(`#comment_item_${id} .comment_title`).html(comment.title)
    showMessage("更新註解成功")
    closeCommentDialog(false)
})

// 顯示註解列表
function showCommentList() {
    if ($("#comment_list").children().length > 0) {
        $("#comment").addClass("comment_show")
    } else {
        showMessage("目前沒有註解可以顯示", 3)
    }
}

// 隱藏註解列表
function hideCommentList() {
    $("#comment").removeClass("comment_show")
}

// 觸動註解列表
function toggleCommentLsit() {
    if ($("#comment").hasClass("comment_show")) {
        hideCommentList()
    } else {
        showCommentList()
    }
}

// 顯示註解文字
function showCommentText(id) {
    clearAllCommentText()
    let comment = loadCommentJson(id)
    $("#container").append(`<div id="comment_text_${id}" class="comment_text comment_text_${comment.position}">${comment.text}</div>`)
    window.setTimeout(function() {
        $(`#comment_text_${id}`).animate({
            opacity: "0"
        }, 500, function() {
            $(this).remove()
        })
    }, comment.duration * 1000)
}

// 移除全部註解文字
function clearAllCommentText() {
    $(".comment_text").remove()
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

// 附加註解項目到註解列表
function appendCommentItem(id, comment) {
    $("#comment_list").append(
        `<div id="comment_item_${id}">
            <div class="delete_comment" data-comment_id="${id}">刪除</div>
            <div class="edit_comment" data-comment_id="${id}">編輯</div>
            <div class="comment_title">${comment.title}</div>
        </div>`
    )
    saveCommentJson(id, comment)

    // 綁定點選跳到註解時間點
    $(`#comment_item_${id} .comment_title`).on("click", function() {
        video.currentTime = loadCommentJson(id).time
        showCommentText(id)
        video.play()
    })

    // 綁定點選顯示編輯註解對話框
    $(`#comment_item_${id} .edit_comment`).on("click", function() {
        let id = parseInt($(this).parent().attr("id").replace("comment_item_", ""))
        let comment = loadCommentJson(id)
        $("#update_comment_dialog_title").data("id", id)
        isInputComment = true
        video.currentTime = comment.time
        video.pause()
        loadJsonToCommentDialog(comment)
        $("#comment_dialog").show()
        $(".new_comment").hide()
        $(".update_comment").show()
    })

    // 綁定點選刪除註解
    $(`#comment_item_${id} .delete_comment`).on("click", function() {
        if (confirm("確認刪除此註解？")) {
            $(this).parent().remove()
            if ($("#comment_list").children().length === 0) {
                hideCommentList()
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
    comment.duration = parseInt($("#comment_duration_input").val())
    return comment
}

// 讀取JSON到註解對話框
function loadJsonToCommentDialog(comment) {
    $("#comment_time_HHMMSS").html(comment.time.toString().toHHMMSS())
    $("#comment_title_input").val(comment.title)
    $(`input:radio[name="comment_text_position"][value="${comment.position}"]`).prop('checked', true)
    $("#comment_text_input").val(comment.text)
    $("#comment_duration_input").val(comment.duration)
}

// 讀取註解的JSON物件
function loadCommentJson(id) {
    return JSON.parse($(`#comment_item_${id}`).data("comment"))
}

// 寫入註解的JSON物件
function saveCommentJson(id, comment) {
    $(`#comment_item_${id}`).data("comment", JSON.stringify(comment))
}