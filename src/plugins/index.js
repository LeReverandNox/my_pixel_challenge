/*jslint node: true this:true es6:true */
/*global this*/
const inert = require("inert");
const vision = require("vision");
const pixel = require("./pixel");

const plugins = [
    inert,
    vision,
    pixel
];

module.exports = plugins;