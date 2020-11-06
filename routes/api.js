var express = require("express");
// importing author routes
var authorRouter = require("./author");
var bookRouter = require("./book");

var app = express();

// controller level routes prefixing.
app.use("/author/", authorRouter);
app.use("/book/", bookRouter);
module.exports = app;