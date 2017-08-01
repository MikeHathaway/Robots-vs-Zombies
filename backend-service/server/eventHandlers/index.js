const gameHandlers = require('./gameHandlers')
const lobbyHandlers = require('./lobbyHandlers')
const Game = global._Game


module.exports = function(io){

  io.sockets.on('connection', setEventHandlers)

}

function setEventHandlers(client){
  console.log('connected!')

  /** GAME HANDLERS */
  client.on('newPlayer', gameHandlers.onNewPlayer)
  client.on('newEnemies', gameHandlers.onNewEnemies)
  client.on('movePlayer', gameHandlers.onMovePlayer)
  client.on('moveEnemy', gameHandlers.onMoveEnemy)
  client.on('shoot', gameHandlers.onShoot)
  client.on('enemyHit', gameHandlers.onEnemyHit)
  client.on('playerAttacked', gameHandlers.onPlayerAttacked)
  client.on('waveComplete', gameHandlers.onWaveComplete)


  /** LOBBY HANDLERS */
  client.on('joinGame', lobbyHandlers.onJoinGame)
  client.on('newGame', lobbyHandlers.onNewGame)
  client.on('gameOver', lobbyHandlers.onGameOver)
  client.on('disconnecting', lobbyHandlers.handleDisconnecting)

  client.on('disconnect', gameHandlers.onSocketDisconnect)

  client.on('test', (data) => { console.log('test successful',data)})
}


//https://gist.github.com/crtr0/2896891
