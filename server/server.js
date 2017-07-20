var path = require('path');
var express = require('express');
var app = new express();
app.use(express.static(path.join(__dirname, '../img')));
module.exports = app;




