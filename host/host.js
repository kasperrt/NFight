var id;
var players = 0;
var player = {};

var Host = {

  show_id: function(data){
    id = data.msg;
    url = data.url;
    document.getElementById("url").innerHTML = url;
    document.getElementById("id").innerHTML = id;
  },

  connect_client: function(data){

    if(players + 1 <= 2)
    {
      players++;
      player[players] = data.msg;
      player[data.msg] = {hp: 100, player: players, timeout: false, blocking: false};
      document.getElementById("hp").innerHTML += "<span id='"+data.msg+"'>Player "+players+": 100</span>";
    }else
    {
      console.log("Game ready");
    }
    console.log("Players: " + players);
  },

  attack_client: function(data){
    console.log(player);
    current_opponent = player[data.player].player === 1 ? 2 : 1;
    current_opponent = player[current_opponent];
    current_player   = data.player;

    if(!player[data.player].timeout){
      player[data.player].blocking = false;

      switch(data.attack_type){
        case "l_hit":
          hp = 2.5;
          break;
        case "h_hit":
          hp = 5;
          break;
        case "l_kick":
          hp = 3;
          break;
        case "h_kick":
          hp = 5.5;
          break;
      }
      if(!player[current_opponent].blocking)
      {
        player[current_opponent].hp -= hp;
        socket.emit("room", {type: "hit", reciever: current_opponent});
      }else
        console.log("Player " + player[current_player].player + " was blocked");
      
      Host.timeout_player(current_player, hp*272.72);
    
      console.log("Player " + player[current_opponent].player + " is being attacked with a: " + data.attack_type);
      console.log("Player " + player[current_opponent].player + " hp: " + player[current_opponent].hp);
      document.getElementById(current_opponent).innerHTML = "Player " + player[current_opponent].player + ": " + player[current_opponent].hp;
    }
  },

  block_client: function(data){
    player[data.player].blocking = true;
    console.log(player[data.player]);
    console.log("Blocking");
  },

  timeout_player: function(p, time){
    console.log(p);
    player[p].timeout = true;
    setTimeout(function(){
      player[p].timeout = false;
    }, time);
  }
};

Main.start();

socket.emit("room", {type: "join"});

socket.on("msg", function(data){
  console.log(data);
  switch(data.type){
    case "id":
      Host.show_id(data);
      break;
    case "connection":
      Host.connect_client(data);
      break;
    case "attack":
      Host.attack_client(data);
      break;
    case "block":
      Host.block_client(data);
      break;
  }
  
});