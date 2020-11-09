"use strict"

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
            let commentItem = JSON.stringify(commentList[i])
            $("#comment_list").append(
                `<div id="comment_list_${i}">
                    <div class="delete_comment" data-comment_id="${i}">刪除</div>
                    <div class="edit_comment" data-comment_id="${i}">編輯</div>
                    <div class="comment_list_item">${commentList[i].title}</div>
                </div>`
            )
            $(`#comment_list_${i}`).data("comment", commentItem)
        }
        $("#select_comment_button").hide()
        $("#comment_source, #comment").show()
        showMessage("讀取註解完成", 1)

        // 綁定註解列表點選動作
        $(".comment_list_item").on("click", function() {
            let comment = JSON.parse($(this).parent().data("comment"))
            video.currentTime = comment.time
            clearAllComment()
            showComment($(this).parent().attr("id").replace("comment_list_", ""), comment.text, comment.duration, comment.position)
        })

        // 綁定刪除註解動作
        $(".delete_comment").on("click", function() {
            if (confirm("確認刪除此註解？")) {
                $(this).parent().remove()
                if ($("#comment_list").children().length === 0) {
                    // 隱藏註解列表（尚未實做）
                }
            }
        })
    }

    // 讀取註解檔
    commentReader.readAsText(commentFile)
})

// 綁定關閉註解對話框按鈕動作
$("#close_comment_dialog").on("click", closeCommentDialog)

// 綁定開啟新增註解對話框動作
$("#add_comment").on("click", showNewCommentDialog)

// 顯示註解
function showComment(id, text, timeOut = 10, position = "left_top") {
    $("#container").append(`<div id="comment_text_${id}" class="comment_text comment_text_${position}">${text}</div>`)
    let commentFadeout = window.setTimeout(function() {
        $(`#comment_text_${id}`).animate({
            opacity: "0"
        }, 500, function() {
            $(this).remove()
        })
    }, timeOut * 1000)
}

// 移除全部註解
function clearAllComment() {
    $(".comment_text").remove()
}

// 顯示新增註解對話框
function showNewCommentDialog() {
    $("#comment_dialog").show()
    $(".new_comment").show()
    $(".update_comment").hide()
}

// 顯示更新註解對話框
function showUpdateCommentDialog(comment) {
    $("#comment_dialog").show()
    $(".new_comment").hide()
    $(".update_comment").show()
}

// 關閉註解對話框
function closeCommentDialog() {
    if (confirm("確定關閉？")) {
        // 清除註解對話框內容
        $("#comment_time").html("")
        $("#comment_title_input, #comment_text_input").val("")
        $("#comment_duration_input").val("10")
        $("#comment_dialog").hide()
    }
}