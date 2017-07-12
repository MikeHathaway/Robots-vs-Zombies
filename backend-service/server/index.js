const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io').listen(server)

const Player = require('./Player').Player
const players = []
const bullets = []

server.lastPlayerID = 0

app.get('/test', (req,res) => {
  res.send('hello!')
})

server.listen(process.env.PORT || 4000, function(){
    console.log('Listening on '+server.address().port)
})


io.sockets.on('connection', setEventHandlers)

function setEventHandlers(client){
  console.log('connected!')
  client.on('newPlayer', onNewPlayer)
  client.on('movePlayer', onMovePlayer)
  client.on('shoot', onShoot)
  client.on('disconnect', onSocketDisconnect)
  client.on('test', (data) => { console.log(data)})
}

function onNewPlayer(data) {
  const newPlayer = new Player(data.x, data.y)
  newPlayer.id = this.id

  console.log('new played added: ', this.id)

  //formely this.broadcast.emit
  io.sockets.emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

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
  console.log('moving player: ', data.id, data.x)

  movePlayer.setX(data.x)
  movePlayer.setY(data.y)
  // formerly this.broadcast.emit
    // had semi broken movement animation with io.sockets.emit
  this.broadcast.emit("movePlayer", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
}

function onShoot(data){
  const bullet = new Bullet(Object.keys(bullets).length, data.pid, data.x, data.y, data.v, data.r, data.tr);
  bullets.push(bullet);
  this.broadcast.emit('shoot', bullet);
  this.emit('shoot', bullet);
}

function onSocketDisconnect() {
  console.log("Player has disconnected: " + this.id)

  const removePlayer = playerById(this.id)
  if (!removePlayer) {
      console.log("Player not found: " + this.id)
      return
  }
  players.splice(players.indexOf(removePlayer), 1)
  this.broadcast.emit('removePlayer', {id: this.id})
  // io.emit('removePlayer', "A user disconnected");
}

function playerById (id) {
  const identifiedPlayer = players.filter(player => player.id === id)
  return identifiedPlayer.length > 0 ? identifiedPlayer[0] : false
}
