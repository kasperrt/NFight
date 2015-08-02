var id;
var players = 0;
var player = {};

var Host = {

  show_id: function(data){
    id = data;
    document.getElementById("id").innerHTML = data;
  },

  connect_client: function(data){

    if(players + 1 <= 2)
    {
      players++;
      player[data.msg] = {hp: 100, player: players};
      document.getElementById("hp").innerHTML += "<span id='"+data.msg+"'>Player "+players+": 100</span>";
    }else
    {
      console.log("Game ready");
    }
    console.log("Players: " + players);
  },

  attack_client: function(data){
    switch(data.attack_type){
      case "l_hit":
        player[data.player].hp -= 2.5;
        break;
      case "h_hit":
        player[data.player].hp -= 5;
        break;
      case "l_kick":
        player[data.player].hp -= 3;
        break;
      case "h_kick":
        player[data.player].hp -= 5.5;
        break;
    }

    console.log("Player " + data.player + " is being attacked with a: " + data.attack_type);
    console.log("Player " + data.player + " hp: " + player[data.player].hp);
    document.getElementById(data.player).innerHTML = "Player " + player[data.player].player + ": " + player[data.player].hp;
  }
};

Main.start();

socket.emit("room", {type: "join"});

socket.on("msg", function(data){
  console.log(data);
  switch(data.type){
    case "id":
      Host.show_id(data.msg);
      break;
    case "connection":
      Host.connect_client(data);
      break;
    case "attack":
      Host.attack_client(data);
      break;
  }
  
});