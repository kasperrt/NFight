var express       = require('express');
var app           = express();
var server        = require('http').createServer(app);
var io            = require('socket.io')(server);
var crypto        = require('crypto');
var socketport    = 3000;
var port          = 8080;
var lists         = [];
var static        = require('node-static');
var MobileDetect  = require('mobile-detect');
var file          = new static.Server('./');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {

        md = new MobileDetect(request.headers['user-agent']);
        if(md.mobile() === null) type = "host";
        else type = "mobile";
        if(request.url == "/style.css") file.serveFile(type+'/style.css', 200, {}, request, response);
        else if(request.url == "/lib/main.js") file.serveFile('lib/main.js', 200, {}, request, response);
        else if(request.url == "/lib/jquery.vibrate.min.js") file.serveFile('lib/jquery.vibrate.min.js', 200, {}, request, response);
        else if(request.url == "/host.js" || request.url == "/mobile.js") file.serveFile(type+'/'+type+'.js', 200, {}, request, response);
        else file.serveFile(type+'/index.html', 200, {}, request, response);

    }).resume();
}).listen(port, function(){console.log('HTTP Server listening at port %d', port)});

server.listen(socketport, function () {
  console.log('Socket.io listening at port %d', port);
});


io.on('connection', function(socket){

  console.log("Connected socket:" + socket);
  var md   = new MobileDetect(socket.handshake.headers['user-agent']);
  var guid = (hash_pass(socket.handshake.headers["user-agent"] + socket.handshake.address + socket.handshake.headers["accept-language"])).substring(0,8);
  var room;
  var player = 1;

  socket.on("room", function(data){
    switch(data.type){
      case "join":
        if(md.mobile() === null)
        {
          var os = require('os');

          var interfaces = os.networkInterfaces();
          var addresses = [];
          for (var k in interfaces) {
              for (var k2 in interfaces[k]) {
                  var address = interfaces[k][k2];
                  if (address.family === 'IPv4' && !address.internal) {
                      addresses.push(address.address);
                  }
              }
          }

          console.log(addresses);
          //socket.join(guid);
          socket.join("1a");
          socket.emit("msg", {type: "id", msg: guid, url: addresses + ":8080"});
        }else{
          console.log(data.room);
          socket.join(guid);
          room = data.room;
          io.to(data.room).emit("msg", {type: "connection", msg: guid});
          socket.emit("msg", {type: "connection", msg: true});
        }
        break;
      case "attack":
        console.log(data.attack_type);
        io.to(room).emit("msg", {type: "attack", attack_type: data.attack_type, player: guid})
        break;
      case "block":
        console.log("block");
        io.to(room).emit("msg", {type: "block", player: guid});
        break;
      case "hit":
        io.to(data.reciever).emit("hit");
        break;
    }
  });
});

function hash_pass(adminpass)
{
  return crypto.createHash('sha256').update(adminpass).digest('base64');
}
