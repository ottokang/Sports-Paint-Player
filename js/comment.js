// 綁定註解檔案上傳動作
$("#comment_source").on("change", function() {
    let file = this.files[0]
    if (false) {
        showMessage(`瀏覽器無法播放此類影片（${file.type}），建議將影片轉檔為 H.264 + AAC 格式。`, 6)
        return
    } else {
        $("#select_comment_button").hide()
        $("#comment_source").show()
        showMessage("加入註解", 1)
    }
})

// 新增註解
function addComment(id, text, timeOut = 10, position = "left_top") {
    $("#container").append(`<div id="comment_${id}" class="comment comment_${position}">${text}</div>`)
    let commentFadeout = window.setTimeout(function() {
        $(`#comment_${id}`).animate({
            opacity: "0"
        }, 500, function() {
            $(this).remove()
        })
    }, timeOut * 1000)
}