//Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

server.listen(5000, () => {
  console.log(`Running server on port 5000`)
});

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
});

var plays = [];

io.on('connection', socket => {
  socket.on('play', function(move) {
    if(plays.length == 0) {
      console.log("played")
      plays.push({socket, move});
    } else {
      var play1 = plays[0];
      var play2 = {socket, move};
      plays = [];

      if(play1.move === play2.move) {
        io.to(`${play1.socket.id}`).emit('result', 'Tie!');
        io.to(`${play2.socket.id}`).emit('result', 'Tie!');
      }
      else if(
        play1.move === "paper" && play2.move === "rock" ||
        play1.move === "scissors" && play2.move === "paper" ||
        play1.move === "rock" && play2.move === "scissors"
      ) {
        io.to(`${play1.socket.id}`).emit('result', "YOU WIN! ");
        io.to(`${play2.socket.id}`).emit('result', "YOU LOSE! ");
      } else {
        io.to(`${play2.socket.id}`).emit('result', "YOU WIN! ");
        io.to(`${play1.socket.id}`).emit('result', "YOU LOSE! ");
      }
    }
  });
});