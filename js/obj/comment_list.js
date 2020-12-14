"use strict"

var commentList = {
    // 顯示註解列表
    show() {
        if ($("#comment_list").children().length > 0) {
            $("#comment").addClass("comment_show")
        } else {
            canvasNav.showMessage("目前沒有註解可以顯示", 3)
        }
    },

    // 隱藏註解列表
    hide() {
        $("#comment").removeClass("comment_show")
    },

    // 觸動註解列表
    toggle() {
        if ($("#comment").hasClass("comment_show")) {
            commentList.hide()
        } else {
            commentList.show()
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


    // 對話框、append

    // 註解對話框拖曳（來自 https://www.w3schools.com/howto/howto_js_draggable.asp）
    setCommentDialogDraggable() {
        var pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0,
            domObject = document.getElementById("comment_dialog")

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
}