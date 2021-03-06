/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

const handlers = (pixelService, io) => {
    const handleNewUser = (socket) => {
        socket.emit("welcome", {
            img: pixelService.getImage(),
            size: pixelService.getImageSize(),
            destroyedPixels: pixelService.getDestroyedPixels()
        });
    };

    const click = (cell) => {
        if (typeof cell !== "object")
            return false;
        if (!cell.hasOwnProperty("x") || !cell.hasOwnProperty("y"))
            return false;

        const wasDestroyed = pixelService.destroyPixel(cell);
        if (wasDestroyed) {
            io.sockets.emit("updateGrid", {
                grid: pixelService.getDestroyedPixels()
            });
        }
    };

    const reset = () => {
        pixelService.resetDestroyedPixels();
        io.sockets.emit("resetGrid");
    };

    return {
        handleNewUser: handleNewUser,
        click: click,
        reset: reset
    };
};

module.exports = handlers;