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
  client.on('newPlayer', onNewPlayer)
  client.on('movePlayer', onMovePlayer)
  client.on('disconnect', onSocketDisconnect)
  client.on('test', (data) => { console.log(data)})
}

function onNewPlayer(data) {
  const newPlayer = new Player(data.x, data.y)
  newPlayer.id = this.id

  //send info to all players, redundant with next function call
  io.sockets.emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

  players.forEach(player => {
    this.emit('newPlayer', {id: player.id, x: player.getX(), y: player.getY()})
  })

  players.push(newPlayer);

}

function onMovePlayer(data) {
  //data.id is currently undefined for some reason
  // console.log(data, data.id)
  const movePlayer = playerById(data.id);

  if (!movePlayer) {
      console.log("Player not found: " + data.id)
      return
  }

  movePlayer.setX(data.x)
  movePlayer.setY(data.y)

  this.emit("movePlayer", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
}

function onSocketDisconnect() {
  console.log("Player has disconnected: " + this.id)

  const removePlayer = playerById(this.id)
  if (!removePlayer) {
      console.log("Player not found: " + this.id)
      return
  }
  players.splice(players.indexOf(removePlayer), 1)
  this.broadcast.emit('remove player', {id: this.id})
  // io.emit('removePlayer', "A user disconnected");
}

function playerById (id) {
  const identifiedPlayer = players.filter(player => player.id === id)
  return identifiedPlayer.length > 0 ? identifiedPlayer[0] : false
}
