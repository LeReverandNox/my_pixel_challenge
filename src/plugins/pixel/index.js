/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

exports.register = (server, options, next) => {
    const io = require('socket.io')(server.listener);

    const pixelService = require("./services/pixelService")(server).init();
    const handlers = require("./handlers")(pixelService);

    io.on("connection", connectionHandler);

    function connectionHandler(socket) {
        handlers.handleNewUser.action(socket);
    }

    next();
};

exports.register.attributes = {
    name: "hapi-pixel"
};