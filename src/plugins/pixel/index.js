/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

exports.register = (server, options, next) => {

    const pixelService = require("./services/pixelService")(server);
    const handlers = require("./handlers")(pixelService);

    pixelService.init()
        .then(() => {
            const io = require('socket.io')(server.listener);
            io.on("connection", connectionHandler);

            function connectionHandler(socket) {
                handlers.handleNewUser.action(socket);
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