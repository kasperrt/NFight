(function(){

  Main.start();

  socket.emit("room", {room: "1a", type: "join"});
  /*socket.emit("room", {type: "attack", attack_type: "l_hit"});
  socket.emit("room", {type: "attack", attack_type: "h_hit"});
*/
  socket.on("msg", function(data){
    switch(data.type){
      case "connection":
        console.log(data.msg);
        break;
    }
  });

  document.getElementById("l_hit").addEventListener("click", function(){
    socket.emit("room", {type: "attack", attack_type: "l_hit"});
  });

  document.getElementById("h_hit").addEventListener("click", function(){
    socket.emit("room", {type: "attack", attack_type: "h_hit"});
  });

  document.getElementById("l_kick").addEventListener("click", function(){
    socket.emit("room", {type: "attack", attack_type: "l_kick"});
  });

  document.getElementById("h_kick").addEventListener("click", function(){
    socket.emit("room", {type: "attack", attack_type: "h_kick"});
  });

})();