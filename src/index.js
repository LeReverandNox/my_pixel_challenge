/*jslint node: true this:true es6:true */
/*global this*/

"use strict";
const Hapi = require("hapi");
const ejs = require("ejs");
const config = require("./config");
const plugins = require("./plugins");
const routes = require("./routes");

const server = new Hapi.Server({
    connections: {
        routes: {
            cors: true
        },
        router: {
            stripTrailingSlash: true
        }
    }
});

server.connection({
    port: config.server.port
});

server.app.argv = process.argv.slice(2);

server.register(plugins, (err) => {
    if (err) {
        throw err;
    }

    server.views({
        engines: { ejs },
        relativeTo: __dirname,
        path: "views"
    });

    server.route(routes);

    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log(`The Pixel Challenge app is now running on port ${server.info.port}`);
    });
});
