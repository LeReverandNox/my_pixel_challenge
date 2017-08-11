/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

const handlers = (pixelService, io) => {
    const handleNewUser = (socket) => {
        console.log("Un user se connecte");
    }

    const click = (cell, cb) => {
        if (typeof cell !== "object")
            return false;
        if (!cell.hasOwnProperty("x") || !cell.hasOwnProperty("y"))
            return false;

        const wasDestroyed = pixelService.destroyPixel(cell);
        if (wasDestroyed) {
            const grid = pixelService.getDestroyedPixels();
            console.log(grid);
            io.sockets.emit("updateGrid", grid);
        }
    }

    return {
        handleNewUser: handleNewUser,
        click: click
    };
};

module.exports = handlers;