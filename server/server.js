var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var crypto = require('crypto');

var socketport = 3000;
var port = 8080;
var lists = [];

var static = require('node-static');
var MobileDetect = require('mobile-detect');

//
// Create a node-static server instance to serve the './' folder
//
var file = new static.Server('./');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {

        md = new MobileDetect(request.headers['user-agent']);
        if(md.mobile() === null) type = "host";
        else type = "mobile";
        if(request.url == "/style.css") file.serveFile(type+'/style.css', 200, {}, request, response);
        else if(request.url == "/lib/main.js") file.serveFile('lib/main.js', 200, {}, request, response);
        else if(request.url == "/host.js" || request.url == "/mobile.js") file.serveFile(type+'/'+type+'.js', 200, {}, request, response);
        else file.serveFile(type+'/index.html', 200, {}, request, response);

    }).resume();
}).listen(port, function(){console.log('HTTP Server listening at port %d', port)});

server.listen(socketport, function () {
  console.log('Socket.io listening at port %d', port);
});


io.on('connection', function(socket){
  console.log("Connected socket:" + socket);
});

