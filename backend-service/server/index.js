const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io').listen(server)
const Player = require('./Player').Player

const players = []

server.lastPlayerID = 0

server.listen(process.env.PORT || 4000, function(){
    console.log('Listening on '+server.address().port)
})


io.on('connection', setEventHandlers)

function setEventHandlers(socket){
  console.log('connected!')
  socket.on('disconnect', onSocketDisconnect)
  socket.on('newPlayer', onNewPlayer)
  socket.on('movePlayer', onMovePlayer)
}

function onSocketDisconnect() {
    console.log("Player has disconnected: " + this.id)
}

function onNewPlayer(data) {
  const newPlayer = new Player(data.x, data.y)
  newPlayer.id = data.id
  this.broadcast.emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

  players.forEach(player => {
    this.emit('newPlayer', {id: player.id, x: player.getX(), y: player.getY()})
  })

  players.push(newPlayer);

}

function onMovePlayer(data) {
  const movePlayer = playerById(data.id);

  if (!movePlayer) {
      console.log("Player not found: " + data.id)
      return
  }

  movePlayer.setX(data.x)
  movePlayer.setY(data.y)

  this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
}
