/*jslint this:true es6:true for:true */
/*global window document io $ randomColor*/

"use strict";

(function (global) {
    var MyPixelChallenge = function () {
        this.socket = null;
        this.image = null;
        this.imageSize = null;
        this.destroyedPixels = [];
        this.$mpcHolder = $("#mpc_holder");
        this.$mainWrapper = $(".main-wrapper");
        this.$resetButton = $("#reset_button");
    };

    MyPixelChallenge.prototype.init = function () {
        this.socket = io();

        this.startSocketListeners();
        this.startDOMListeners();
    };

    MyPixelChallenge.prototype.startSocketListeners = function () {
        var self = this;

        this.socket.on("welcome", function (data) {
            self.image = data.img;
            self.imageSize = data.size;
            self.destroyedPixels = data.destroyedPixels;

            self.initImg();
            self.initGrid();
            self.updateGrid();
        });

        this.socket.on("updateGrid", function (data) {
            self.destroyedPixels = data.grid;
            self.updateGrid();
        });

        this.socket.on("resetGrid", function (data) {
            self.destroyedPixels = [];
            self.initGrid();
        });
    };

    MyPixelChallenge.prototype.startDOMListeners = function () {
        var self = this;
        this.$mpcHolder.on("click", function (e) {
            var x = $(e.target).index();
            var y = $(e.target.parentElement).index();

            self.destroyPixel(x, y);
        });

        this.$resetButton.on("click", function (e) {
            self.reset();
        });
    };

    MyPixelChallenge.prototype.destroyPixel = function (x, y) {
        this.socket.emit("click", {
            x: x,
            y: y
        });
    };

    MyPixelChallenge.prototype.reset = function () {
        this.socket.emit("reset");
    };

    MyPixelChallenge.prototype.initImg = function () {
        this.$mpcHolder.css("background-image", "url(\"" + this.image + "\")");
        this.$mpcHolder.css("width", this.imageSize.width * 30 + "px");
        this.$mpcHolder.css("height", this.imageSize.height * 30 + "px");

        this.$mainWrapper.css("min-width", this.imageSize.width * 30 + "px");
        this.$mainWrapper.css("min-height", this.imageSize.height * 30 + "px");
    };

    MyPixelChallenge.prototype.initGrid = function () {
        var i, j, $row, $cell;
        var colors = randomColor({
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
    };

    MyPixelChallenge.prototype.findCellAt = function (x, y) {
        return this.$mpcHolder.find(".grid-row").eq(y).find(".grid-cell").eq(x);

    };

    MyPixelChallenge.prototype.updateGrid = function () {
        var self = this;
        var $cell;
        this.destroyedPixels.forEach(function (pixel) {
            $cell = self.findCellAt(pixel.x, pixel.y);
            $cell.css("background-color", "transparent");
        });
    };


    document.addEventListener("DOMContentLoaded", function () {
        var mpc = new MyPixelChallenge();
        mpc.init();
    });

    global.MyPixelChallenge = MyPixelChallenge;
}(window));
