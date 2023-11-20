"use strict";

var polygon = {
    _colors: {
        紅色: "#f542a7",
        藍色: "#0033cc",
        黃色: "#e8c62e",
    },
    _isDrawing: false,
    _originMouseCursor: null,
    _polygonVertex: [],

    // 初始物件設定
    init() {
        // 依照多邊形顏色設定 UI 選項
        $("#polygon_color").html("");
        $.each(this._colors, function (colorName, value) {
            $("#polygon_color").append(`<option value="${value}" style="color:${value};">${colorName}</option>`);
        });

        // 設定預設為第二選項
        $("#polygon_color").prop("selectedIndex", 1);
        $("#polygon_color").css("color", $("#polygon_color").val());
    },

    // 重置物件設定
    reset() {
        this._polygonVertex = [];
        this._isDrawing = false;
    },

    // 切換物件後設定物件選項
    setup() {
        // 設定畫布滑鼠指標、畫筆顏色、屬性
        $("#canvas_area").css("cursor", "pointer");
        ctx.strokeStyle = `rgba(${this._hexToRgb($("#polygon_color").val())}, ${Number.parseFloat($("#polygon_transparency").val())})`;
        ctx.fillStyle = `rgba(${this._hexToRgb($("#polygon_color").val())}, ${Number.parseFloat($("#polygon_transparency").val())})`;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 2;
    },

    mouseup(e) {
        this.setup();
        $("#canvas_area").css("cursor", "progress");
        this._isDrawing = true;
        this._polygonVertex.push({
            x: e.offsetX,
            y: e.offsetY,
        });
    },

    mousemove(e) {
        if (this._isDrawing === true) {
            // 繪製時顯示虛線，邊框線條不透明加粗
            $("#canvas_area").css("cursor", "progress");
            ctx.setLineDash([30, 30]);
            ctx.strokeStyle = `rgba(${this._hexToRgb($("#polygon_color").val())}, 1)`;
            ctx.lineWidth = 4;
            this._draw(e, "雙擊左鍵完成繪製");
        }
    },

    dblclick(e) {
        if (this._isDrawing === true) {
            console.log(this._polygonVertex.length);
            // 多邊形繪製低於 3 點提示訊息
            if (this._polygonVertex.length < 4) {
                canvasNav.showMessage("請繪製超過 3 點", 2);
                return;
            }

            ctx.setLineDash([]); // 完成時取消虛線
            this._draw(e);
            this._isDrawing = false;
            this._polygonVertex = [];
            $("#canvas_area").css("cursor", "pointer");
        }
    },

    _draw(e = null, withText = null) {
        canvasNav.clearCanvas(false);
        ctx.beginPath();
        let i = 0;
        ctx.moveTo(this._polygonVertex[i].x, this._polygonVertex[i].y);
        for (i = 1; i < this._polygonVertex.length; i++) {
            ctx.lineTo(this._polygonVertex[i].x, this._polygonVertex[i].y);
        }
        if (e !== null) {
            ctx.lineTo(e.offsetX, e.offsetY);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        // 繪製說明文字，繪製完成後還原
        if (withText !== null) {
            ctx.save();
            ctx.fillStyle = `rgba(${this._hexToRgb($("#polygon_color").val())})`;
            ctx.font = "20px sans-serif";
            ctx.fillText(withText, e.offsetX, e.offsetY);
            ctx.restore();
        }
    },

    _hexToRgb(hex) {
        return hex
            .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => "#" + r + r + g + g + b + b)
            .substring(1)
            .match(/.{2}/g)
            .map((x) => Number.parseInt(x, 16))
            .join(",");
    },
};
