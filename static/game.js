const socket = io();

function rock() {
  socket.emit('play', 'rock');
}

function paper() {
  socket.emit('play', 'paper');
}

function scissors() {
  socket.emit('play', 'scissors');
}

socket.on('result', function (message) {
  alert(message);
});
