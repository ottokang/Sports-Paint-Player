"use strict"

// 設定是否在輸入註解，暫停熱鍵用
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

// 綁定關閉註解對話框按鈕動作
$("#close_comment_dialog").on("click", closeCommentDialog)

// 綁定開啟新增註解對話框動作
$("#add_comment").on("click", showNewCommentDialog)

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
function showCommentText(id, text, timeOut = 10, position = "left_top") {
    $("#container").append(`<div id="comment_text_${id}" class="comment_text comment_text_${position}">${text}</div>`)
    let commentFadeout = window.setTimeout(function() {
        $(`#comment_text_${id}`).animate({
            opacity: "0"
        }, 500, function() {
            $(this).remove()
        })
    }, timeOut * 1000)
}

// 移除全部註解文字
function clearAllCommentText() {
    $(".comment_text").remove()
}

// 顯示新增註解對話框
function showNewCommentDialog() {
    isInputComment = true
    video.pause()
    $("#comment_dialog").show()
    $(".new_comment").show()
    $(".update_comment").hide()
    $("#comment_position_center").prop("checked", "checked")
}

// 顯示更新註解對話框
function showUpdateCommentDialog(comment) {
    isInputComment = true
    video.pause()
    $("#comment_dialog").show()
    $(".new_comment").hide()
    $(".update_comment").show()
    // 讀取資料到註解對話框中（尚未實做）
}

// 關閉註解對話框
function closeCommentDialog() {
    if (confirm("確定關閉註解？")) {
        // 清除註解對話框內容
        $("#comment_time").html("")
        $("#comment_title_input, #comment_text_input").val("")
        $("#comment_duration_input").val("10")
        $("#comment_dialog").hide()
        isInputComment = false
    }
}

// 寫入註解到列表
function saveComment(id = false, comment) {
    if (id === false) {
        // 找最後一個ID
        id = (parseInt($("#comment_list > div:last").attr("id").replace("comment_list_", "")) + 1).toString()
        appendCommentItem(id, comment)
    } else {
        $(`#comment_list_${id}`).data("comment", JSON.stringify(comment))
        // 這邊可能需要重新綁定
    }
}

// 附加註解項目到註解選單
function appendCommentItem(commentId, comment) {
    $("#comment_list").append(
        `<div id="comment_list_${commentId}">
            <div class="delete_comment" data-comment_id="${commentId}">刪除</div>
            <div class="edit_comment" data-comment_id="${commentId}">編輯</div>
            <div class="comment_list_item">${comment.title}</div>
        </div>`
    )
    $(`#comment_list_${commentId}`).data("comment", JSON.stringify(comment))

    // 綁定註解點選動作
    $(`#comment_list_${commentId} .comment_list_item`).on("click", function() {
        video.currentTime = comment.time
        clearAllCommentText()
        showCommentText(commentId, comment.text, comment.duration, comment.position)
    })

    // 綁定刪除註解動作
    $(`#comment_list_${commentId} .delete_comment`).on("click", function() {
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

}