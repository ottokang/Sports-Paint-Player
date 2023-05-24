"use strict";

var polygon = {
    _originMouseCursor: null,
    colors: {
        黃色: "#e8c62e",
        藍色: "#0033cc",
        紅色: "#f542a7",
    },
    _polygonVertex: [],
    _isDrawing: false,

    reset() {
        this._polygonVertex = [];
        this._isDrawing = false;
    },

    setup() {
        // 設定畫布滑鼠指標、畫筆顏色、屬性
        $("#container").css("cursor", "auto");
        ctx.strokeStyle = `rgba(${this._hexToRgb($("#polygon_color").val())}, ${Number.parseFloat($("#polygon_transparency").val())})`;
        ctx.fillStyle = `rgba(${this._hexToRgb($("#polygon_color").val())}, ${Number.parseFloat($("#polygon_transparency").val())})`;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 2;
    },

    mouseup(e) {
        this.setup();
        $("#container").css("cursor", "pointer");
        this._isDrawing = true;
        this._polygonVertex.push({
            x: e.offsetX,
            y: e.offsetY,
        });
    },

    mousemove(e) {
        if (this._isDrawing === true) {
            // 繪製時顯示虛線，邊框線條不透明加粗
            ctx.setLineDash([30, 30]);
            ctx.strokeStyle = `rgba(${this._hexToRgb($("#polygon_color").val())}, 1)`;
            ctx.lineWidth = 4;
            this._draw(e, "雙擊左鍵完成繪製");
        }
    },

    dblclick(e) {
        if (this._isDrawing === true) {
            ctx.setLineDash([]); // 完成時取消虛線
            this._draw(e);
            this._isDrawing = false;
            this._polygonVertex = [];
            $("#container").css("cursor", "auto");
            canvasNav.showOSD("繪製多邊形完成");
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
