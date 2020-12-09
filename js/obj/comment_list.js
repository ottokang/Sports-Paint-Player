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
    }


    // 對話框、append
}