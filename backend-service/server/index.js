const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io').listen(server)

const Player = require('./Player').Player
const players = []

server.lastPlayerID = 0

app.get('/test', (req,res) => {
  res.send('hello!')
})

server.listen(process.env.PORT || 4000, function(){
    console.log('Listening on '+server.address().port)
})


io.on('connection', setEventHandlers)

function setEventHandlers(client){
  console.log('connected!')
  client.emit('connection') //probably unnecessary
  client.on('newPlayer', onNewPlayer)
  client.on('movePlayer', onMovePlayer)
  client.on('disconnect', onSocketDisconnect)
}


function onNewPlayer(data) {
  console.log(data)
  const newPlayer = new Player(data.x, data.y)
  newPlayer.id = this.id
  this.broadcast.emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

  players.forEach(player => {
    this.emit('newPlayer', {id: player.id, x: player.getX(), y: player.getY()})
  })

  players.push(newPlayer);

}

function onMovePlayer(data) {
  //data.id is currently undefined for some reason
  console.log(data)
  const movePlayer = playerById(data.id);
console.log(movePlayer)
  if (!movePlayer) {
      console.log("Player not found: " + data.id)
      return
  }

  movePlayer.setX(data.x)
  movePlayer.setY(data.y)

  this.broadcast.emit("movePlayer", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
}

function onSocketDisconnect() {
  io.emit('removePlayer', "A user disconnected");
  console.log("Player has disconnected: " + this.id)
}

function playerById (id) {
  const identifiedPlayer = players.filter(player => player.id === id)
  return identifiedPlayer.length > 0 ? identifiedPlayer[0] : false
}
