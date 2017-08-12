/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

const base64 = require('node-base64-image');
const path = require("path");
const fileType = require('file-type');

const pixelService = (server) => {
    const init = async () => {
        if (!server.app.argv[0])
            throw "No image URL provided, please provide a valid image URL to play with. Exiting.";
        if (!server.app.argv[1])
            throw "No image width provided, please provide an image width in px. Exiting.";
        if (!server.app.argv[2])
            throw "No image height provided, please provide an image width in px. Exiting.";

        this.imgUrl = server.app.argv[0];
        this.imgWidth = server.app.argv[1];
        this.imgHeight = server.app.argv[2];
        this.imgData = await downloadImage(this.imgUrl);

        this.destroyedPixels = [];

        return true;
    };

    const downloadImage = async (url) => {
        return new Promise((resolve, reject) => {
            function errCb (err) {
                console.error(err);
                reject("Can't retrieve the image, please check the URL or the path. Exiting.");
            };

            function toBase64(buffer) {
                try {
                    const data = buffer.toString("base64");
                    const type = fileType(buffer);

                    resolve(`data:${type.mime};base64,${data}`);
                } catch (err) {
                    errCb(err);
                }
            };

            if (path.isAbsolute(url)) {
                const options = { local: true};
                base64.encode(url, options, (err, image) => {
                    if (err) {
                        errCb(err);
                    }
                    toBase64(image);
                });
            } else {
                const options = {};
                base64.encode(url, options, (err, image) => {
                    if (err) {
                        errCb(err);
                    }
                    toBase64(image);
                });
            }
        });
    };

    const destroyPixel = (cell) => {
        if (isPixelDestroyed(cell) || !isPixelInImage(cell))
            return false;

        addDestroyedPixel(cell);
        return true;
    };

    const isPixelDestroyed = (cell) => {
        return this.destroyedPixels.find(pixel => {
            return pixel.x === cell.x && pixel.y === cell.y;
        });
    };

    const isPixelInImage = (cell) => {
        const isXOk = cell.x >= 0 && cell.x <= this.imgWidth;
        const isYOk = cell.y >= 0 && cell.y <= this.imgHeight;

        return isXOk && isYOk;
    };

    const addDestroyedPixel = (cell) => {
        this.destroyedPixels.push(cell);
    };

    const getDestroyedPixels = () => {
        return this.destroyedPixels;
    }

    const getImage = () => {
        return this.imgData;
    };

    const getImageSize = () => {
        return {
            width: this.imgWidth,
            height: this.imgHeight
        };
    };

    return {
        init: init,
        destroyPixel: destroyPixel,
        getDestroyedPixels: getDestroyedPixels,
        getImage: getImage,
        getImageSize: getImageSize
    };
};

module.exports = pixelService;