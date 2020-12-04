"use strict"

// 設定是否正在輸入註解，暫停熱鍵用
var isInputComment = false

// 清除註解檔案名稱（設定下載）
$("#comment_source").val("")

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
            canvasNav.showMessage(`上傳的註解檔案"${commentFile.name}"有錯誤，無法解析內容`, 6)
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
        canvasNav.showMessage("讀取註解完成", 1)
    }

    // 讀取註解檔
    commentReader.readAsText(commentFile)
})

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

// 綁定註解對話框可以拖曳
dragElement(document.getElementById("comment_dialog"))

// 綁定點選顯示新增註解對話框動作
$("#add_comment").on("click", function() {
    isInputComment = true
    video.pause()
    // 清除註解對話框內容、建立預設值
    $("#comment_time_HHMMSS").val("")
    $("#comment_title_input, #comment_text_input").val("")
    $("#comment_duration_input").val("10")

    // 顯示新增註解對話框
    showCommentDialog("add")
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
        showCommentList()
        closeCommentDialog(false)
    }
})

// 綁定點選註解更新提交按鈕動作
$("#update_comment_submit").on("click", function() {
    if (validateCommentDialog()) {
        let id = $("#update_comment_dialog_title").data("id")
        let comment = loadCommentDialogToJson()
        saveCommentJson(id, comment)
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

// 顯示註解列表
function showCommentList() {
    if ($("#comment_list").children().length > 0) {
        $("#comment").addClass("comment_show")
    } else {
        canvasNav.showMessage("目前沒有註解可以顯示", 3)
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

// 移到下一個註解
function nextComment() {
    if ($("#comment_list").children().length === 0) {
        canvasNav.showMessage("目前沒有註解可以顯示", 2)
        return
    }

    // 如果都沒有選取，從第一個開始
    if ($(".current_comment_item").length === 0) {
        $(".comment_title:first").addClass("current_comment_item")
    } else {
        // 選取下一個註解
        if ($(".current_comment_item").parent().next().children(".comment_title").length === 0) {
            canvasNav.showMessage("已經到最後一個註解", 2)
            return
        } else {
            let currentCommentItem = $(".current_comment_item")
            $(".current_comment_item").parent().next().children(".comment_title").addClass("current_comment_item")
            currentCommentItem.removeClass("current_comment_item")
        }
    }

    $(".current_comment_item")[0].click()
}

// 移到上一個註解
function prevComment() {
    if ($("#comment_list").children().length === 0) {
        canvasNav.showMessage("目前沒有註解可以顯示", 2)
        return
    }

    // 如果都沒有選取，從最後一個開始
    if ($(".current_comment_item").length === 0) {
        $(".comment_title:last").addClass("current_comment_item")
    } else {
        // 選取上一個註解
        if ($(".current_comment_item").parent().prev().children(".comment_title").length === 0) {
            canvasNav.showMessage("已經到第一個註解", 2)
            return
        } else {
            let currentCommentItem = $(".current_comment_item")
            $(".current_comment_item").parent().prev().children(".comment_title").addClass("current_comment_item")
            currentCommentItem.removeClass("current_comment_item")
        }
    }

    $(".current_comment_item")[0].click()
}

// 重新載入目前註解
function reloadComment() {
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
}

// 顯示註解文字
function showCommentText(id) {
    let devModeTime = 1
    if (developmentMode === 1) {
        devModeTime = 1000
    }
    clearAllCommentText()
    let comment = loadCommentJson(id)
    let commentText = handleCommentText(comment.text)
    $("#container").append(`<div id="comment_text_${id}" class="comment_text comment_text_${comment.position}">${commentText}</div>`)
    window.setTimeout(function() {
        $(`#comment_text_${id}`).animate({
            opacity: "0"
        }, 500, function() {
            $(this).remove()
        })
    }, comment.duration * 1000 * devModeTime)
}

// 移除全部註解文字
function clearAllCommentText() {
    $(".comment_text").remove()
}

// 處理註解文字的換行、空白
function handleCommentText(commentText) {
    commentText = commentText.replace(/ /g, "&nbsp;")
    commentText = commentText.replace(/\n/g, "<br>")
    return commentText
}

// 顯示註解對話框
function showCommentDialog(type) {
    $("#comment_dialog").show()
    $("#comment_title_input").focus()
    $("#comment_dialog").css({
        top: "25%",
        left: "40%"
    })
    if (type === "add") {
        $(".new_comment").show()
        $(".update_comment").hide()
        $("#comment_time_HHMMSS").val(video.currentTime.toString().toHHMMSS())
        $("#comment_position_center").prop("checked", "checked")
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
    saveCommentJson(id, comment)

    // 綁定點選跳到註解時間點，顯示註解文字
    $(`#comment_item_${id} .comment_title`).on("click", function() {
        $(".current_comment_item").removeClass("current_comment_item")
        video.currentTime = loadCommentJson(id).time
        $(this).addClass("current_comment_item")
        showCommentText(id)
        video.play()
    })

    // 綁定點選顯示編輯註解對話框
    $(`#comment_item_${id} .edit_comment`).on("click", function() {
        let id = $(this).parent().attr("id").replace("comment_item_", "")
        let comment = loadCommentJson(id)
        $("#update_comment_dialog_title").data("id", id)
        isInputComment = true
        video.currentTime = comment.time
        video.pause()
        loadJsonToCommentDialog(comment)
        showCommentDialog("edit")
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

// 讀取註解的JSON物件
function loadCommentJson(id) {
    return JSON.parse($(`#comment_item_${id}`).data("comment"))
}

// 寫入註解的JSON物件
function saveCommentJson(id, comment) {
    $(`#comment_item_${id}`).data("comment", JSON.stringify(comment))
}

// 註解對話框拖曳（來自 https://www.w3schools.com/howto/howto_js_draggable.asp）
function dragElement(domObject) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0
    document.getElementById("new_comment_dialog_title").onmousedown = dragMouseDown
    document.getElementById("update_comment_dialog_title").onmousedown = dragMouseDown

    function dragMouseDown(e) {
        e = e || window.event
        e.preventDefault()
        // get the mouse cursor position at startup:
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag
    }

    function elementDrag(e) {
        e = e || window.event
        e.preventDefault()
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY
        // set the element's new position:
        domObject.style.top = (domObject.offsetTop - pos2) + "px"
        domObject.style.left = (domObject.offsetLeft - pos1) + "px"
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null
        document.onmousemove = null
    }
}