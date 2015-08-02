var socket;

var Main = {

  start: function(){
    socket = io.connect('http://'+window.location.hostname+':3000');
  }

}