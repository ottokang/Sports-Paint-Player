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

        $("#comment_list").empty()
        for (let i = 0; i < commentList.length; i++) {
            let commentItem = JSON.stringify(commentList[i])
            $("#comment_list").append(
                `<div id="comment_list_${i}" class="comment_list_item">${commentList[i].title}</div>`)
            $(`#comment_list_${i}`).data("comment", commentItem)
        }
        $("#select_comment_button").hide()
        $("#comment_source, #comment_list").show()
        showMessage("讀取註解完成", 1)

        // 綁定註解列表點選動作
        $(".comment_list_item").on("click", function() {
            let comment = JSON.parse($(this).data("comment"))
            video.currentTime = comment.time
            clearAllComment()
            showComment($(this).attr("id").replace("comment_list_", ""), comment.text, comment.duration, comment.position)
        })
    }

    // 讀取註解檔
    commentReader.readAsText(commentFile)
})

// 顯示註解
function showComment(id, text, timeOut = 10, position = "left_top") {
    $("#container").append(`<div id="comment_${id}" class="comment comment_${position}">${text}</div>`)
    let commentFadeout = window.setTimeout(function() {
        $(`#comment_${id}`).animate({
            opacity: "0"
        }, 500, function() {
            $(this).remove()
        })
    }, timeOut * 1000)
}

// 移除全部註解
function clearAllComment() {
    $(".comment").remove()
}