var express = require("express");
// importing author routes
var authorRouter = require("./author");

var app = express();

// controller level routes prefixing.
app.use("/author/", authorRouter);

module.exports = app;