var express = require('express');
var app = express();
//var redis = require('redis');

var http = require('http').Server(app);
var handlers = require('./src/handlers');


handlers.configExpress(app);

http.listen(8080, function () {
    console.log('listening on *:8080');
});
