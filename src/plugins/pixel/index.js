/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

exports.register = (server, options, next) => {

    const pixelService = require("./services/pixelService")(server);

    pixelService.init()
        .then(() => {
            const io = require("socket.io")(server.listener);
            io.on("connection", connectionHandler);

            const handlers = require("./handlers")(pixelService, io);
            function connectionHandler(socket) {
                handlers.handleNewUser(socket);

                socket.on("click", handlers.click);
            }

            next();
        })
        .catch((err) => {
            next(err);
        });
};

exports.register.attributes = {
    name: "hapi-pixel"
};