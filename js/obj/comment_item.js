"use strict"

var commentItem = {
    // 顯示註解文字
    showText(id) {
        let devModeTime = 1
        if (developmentMode === 1) {
            devModeTime = 1000
        }
        this.clearAllText()
        let comment = this.loadJson(id)
        video.currentTime = comment.time
        $("#container").append(
            `<div id="comment_text_${id}" class="comment_text comment_text_${comment.position}">${this._filterToHTML(comment.text)}</div>`)
        window.setTimeout(function() {
            $(`#comment_text_${id}`).animate({
                opacity: "0"
            }, 500, function() {
                $(this).remove()
            })
        }, comment.duration * 1000 * devModeTime)
    },

    // 移除全部註解文字
    clearAllText() {
        $(".comment_text").remove()
    },

    // 讀取註解的JSON物件
    loadJson(id) {
        return JSON.parse($(`#comment_item_${id}`).data("comment"))
    },

    // 寫入註解的JSON物件
    saveJson(id, comment) {
        $(`#comment_item_${id}`).data("comment", JSON.stringify(comment))
    },

    // 過濾換行、空白符號為HTML標籤
    _filterToHTML(text) {
        text = text.replace(/ /g, "&nbsp;")
        text = text.replace(/\n/g, "<br>")
        return text
    }
}