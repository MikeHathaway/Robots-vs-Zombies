import client from '../../client'

const allPlayers = [] //copy of original in game.

function setEventHandlers(){
  // Socket connection successful
  client.on('connection', onSocketConnected)

  // Socket disconnection
  client.on('disconnect', onSocketDisconnect)

  // New player message received
  client.on('newPlayer', onNewPlayer)

  // Player move message received
  client.on('movePlayer', onMovePlayer)

  // Player removed message received
  client.on('removePlayer', onRemovePlayer)
}

function onSocketConnected(){
  console.log('connected!')
  socket.emit('newPlayer')
}

function onSocketDisconnect(){
  console.log('Disconnected from socket server')
}

function onNewPlayer(data){
  console.log('New player connected:', data.id)

  const duplicate = playerById(data.id)
  if (duplicate) {
    console.log('Duplicate player!')
    return
  }
  allPlayers.push(new Player(game,gameWidth,gameHeight,50,5,'zombie'))
}

function onMovePlayer(){}

function onRemovePlayer(data){
  const removePlayer = playerById(data.id)

  // Player not found
  if (!removePlayer) {
    console.log('Player not found: ', data.id)
    return
  }

  removePlayer.player.kill()
  allPlayers.splice(allPlayers.indexOf(removePlayer), 1)
}

function playerById (id) {
  const identifiedPlayer = allPlayers.filter(player => player.id === id)[0]
  return identifiedPlayer.length > 0 ? identifiedPlayer : false
}
