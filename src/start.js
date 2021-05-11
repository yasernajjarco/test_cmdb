#!/usr/bin/env node

/**
 * this file for launch application with node js 
 * nodemon --exec babel-node src/server.js replace with => node src/start.js => for the machine linux
 */
require("@babel/register")({
    presets: ["@babel/preset-env"]
});

// Import the rest of our application.
module.exports = require('./server.js')