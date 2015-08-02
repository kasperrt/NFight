var id;
var players = 0;
var hp      = {};

var Host = {

  show_id: function(data){
    id = data;
    document.getElementById("id").innerHTML = data;
  },

  connect_client: function(data){

    if(players + 1 <= 2)
    {
      players++;
      hp[data.msg] = 100;
    }else
    {
      console.log("Game ready");
    }
    console.log("Players: " + players);
  },

  attack_client: function(data){
    switch(data.attack_type){
      case "l_hit":
        hp[data.player] -= 2.5;
        break;
      case "h_hit":
        hp[data.player] -= 5;
        break;
      case "l_kick":
        hp[data.player] -= 3;
        break;
      case "h_kick":
        hp[data.player] -= 5.5;
        break;
    }

    console.log("Player " + data.player + " is being attacked with a: " + data.attack_type);
    console.log("Player " + data.player + " hp: " + hp[data.player]);
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