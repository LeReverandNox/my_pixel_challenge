/*jslint this:true es6:true for:true */
/*global window document io $ randomColor*/

"use strict";

class MyPixelChallenge {
    constructor() {
        this.socket = null;
        this.image = null;
        this.imageSize = null;
        this.destroyedPixels = [];
        this.$mpcHolder = $("#mpc_holder");
        this.$mainWrapper = $(".main-wrapper");
        this.$resetButton = $("#reset_button");
        this.socket = io();

        this.startSocketListeners();
        this.startDOMListeners();
    }

    startSocketListeners() {
        this.socket.on("welcome", data => {
            this.image = data.img;
            this.imageSize = data.size;
            this.destroyedPixels = data.destroyedPixels;

            this.initImg();
            this.initGrid();
            this.updateGrid();
        });

        this.socket.on("updateGrid", data => {
            this.destroyedPixels = data.grid;
            this.updateGrid();
        });

        this.socket.on("resetGrid", data => {
            this.destroyedPixels = [];
            this.initGrid();
        });
    }

    startDOMListeners() {
        this.$mpcHolder.on("click", e => {
            const x = $(e.target).index();
            const y = $(e.target.parentElement).index();

            this.destroyPixel(x, y);
        });

        this.$resetButton.on("click", e => {
            this.reset();
        });
    }

    destroyPixel(x, y) {
        this.socket.emit("click", {x, y});
    }

    reset() {
        this.socket.emit("reset");
    }

    initImg() {
        this.$mpcHolder.css("background-image", "url(\"" + this.image + "\")");
        this.$mpcHolder.css("width", this.imageSize.width * 30 + "px");
        this.$mpcHolder.css("height", this.imageSize.height * 30 + "px");

        this.$mainWrapper.css("min-width", this.imageSize.width * 30 + "px");
        this.$mainWrapper.css("min-height", this.imageSize.height * 30 + "px");
    }

    initGrid() {
        let i, j, $row, $cell;
        const colors = randomColor({
            count: 5,
            hue: "random"
        });

        this.$mpcHolder.empty();
        for (i = 0; i < this.imageSize.height; i += 1) {
            $row = $("<div class=\"grid-row\"></div>").appendTo(this.$mpcHolder);
            for (j = 0; j < this.imageSize.width; j += 1) {
                $cell = $("<div class=\"grid-cell\"></div>").appendTo($row);
                $cell.css("background-color", colors[Math.floor(Math.random() * colors.length)]);
            }
        }
    }

    findCellAt(x, y) {
        return this.$mpcHolder.find(".grid-row").eq(y).find(".grid-cell").eq(x);
    }

    updateGrid() {
        this.destroyedPixels.forEach(({x, y}) => {
            this.findCellAt(x, y).css("background-color", "transparent");
        });
    }
}

(global => {
    document.addEventListener("DOMContentLoaded", () => {
         new MyPixelChallenge();
    });

    global.MyPixelChallenge = MyPixelChallenge;
})(window);
