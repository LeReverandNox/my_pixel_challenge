/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

// var tools = require("../lib/tools");
const base64 = require('node-base64-image');
const path = require("path");

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

        this.shownPixels = [];

        return true;
    };

    const downloadImage = async (url) => {
        return new Promise((resolve, reject) => {
            if (path.isAbsolute(url)) {
                const options = { local: true, string: true };
                base64.encode(url, options, (err, image) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(image);
                });
            } else {
                const options = { string: true };
                base64.encode(url, options, (err, image) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(image);
                });
            }
        });
    }

    return {
        init: init
    };
};

module.exports = pixelService;