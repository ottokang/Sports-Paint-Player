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
    }
}