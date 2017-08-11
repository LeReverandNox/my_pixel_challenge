/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

const handlers = (pixelService, io) => {
    const handleNewUser = (socket) => {
        console.log("Un user se connecte");
    }

    return {
        handleNewUser: handleNewUser
    };
};

module.exports = handlers;