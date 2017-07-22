import io from 'socket.io-client'

import EventEmitter from 'eventemitter3'

import Player from '../models/player'
import game from '../states/game'
import playerHandlers from './playerHandlers'
import enemyHandlers from './enemyHandlers'

const socket = io('http://localhost:4000')
// const socket = io('https://backend-service-dlclbqtjko.now.sh')

const playerObs = new EventEmitter()

function setEventHandlers(){

  /** LOBBY EVENTS */
  // trigger connection to game server
  socket.emit('joinGame', {data: 'Start Game'})

  // receive new game data from server
  socket.on('newGame', onNewGame)


  /** PLAYER EVENTS */
  // New player message received
  socket.on('newPlayer', playerHandlers.onNewPlayer)

  // Player move message received
  socket.on('movePlayer', playerHandlers.onMovePlayer)

  //shootPlayer(data.id,data.pid,data.x,data.y,data.v,data.r,data.tr);
  socket.on('shoot', playerHandlers.onShoot)

  // Player removed message received
  socket.on('removePlayer', playerHandlers.onRemovePlayer)

  // Socket disconnection
  socket.on('disconnect', playerHandlers.onSocketDisconnect)


  /** ENEMY EVENTS */
  // add enemies to the game
  socket.on('newEnemies', enemyHandlers.onNewEnemies)

  // Enemy move message received
  socket.on('moveEnemy', enemyHandlers.onMoveEnemy)

  //bulletHitPlayer(data);
  socket.on('enemyHit', enemyHandlers.onEnemyHit)

  socket.on('test', (data) => console.log('test', data))
}


function sendNewPlayer(data,game){
  return socket.emit('newPlayer', {x: game.startX, y: game.startY, id: data.id, gameID: data.gameID})
}

function onNewGame(data){
  console.log('new game data', data, game.startX, game.startY)
  sendNewPlayer(data,game)
}




export {socket, setEventHandlers, playerObs}
