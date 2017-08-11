/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

const baseRoutes = [
    {
        method: "GET",
        path: "/",
        handler: (request, reply) => {
            reply.view("index");
        }
    }
];

module.exports = baseRoutes;