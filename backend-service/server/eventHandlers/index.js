const gameHandlers = require('./gameHandlers')
const lobbyHandlers = require('./lobbyHandlers')
const Game = global._Game


module.exports = function(io){

  io.sockets.on('connection', setEventHandlers)

}

function setEventHandlers(socket){
  console.log('connected!')

  /** GAME HANDLERS */
  socket.on('newPlayer', gameHandlers.onNewPlayer)
  socket.on('newEnemies', gameHandlers.onNewEnemies)
  socket.on('movePlayer', gameHandlers.onMovePlayer)
  socket.on('moveEnemy', gameHandlers.onMoveEnemy)
  socket.on('shoot', gameHandlers.onShoot)
  socket.on('enemyHit', gameHandlers.onEnemyHit)
  socket.on('playerAttacked', gameHandlers.onPlayerAttacked)
  socket.on('waveComplete', gameHandlers.onWaveComplete)


  /** LOBBY HANDLERS */
  socket.on('joinGame', lobbyHandlers.onJoinGame)
  socket.on('newGame', lobbyHandlers.onNewGame)
  socket.on('gameOver', lobbyHandlers.onGameOver)
  socket.on('disconnecting', lobbyHandlers.onDisconnecting)
  socket.on('disconnect', lobbyHandlers.onSocketDisconnect)

  socket.on('error', (error) => console.error(error))
  socket.on('test', (data) => console.log('test successful',data))
}
