import io from 'socket.io-client'

import EventEmitter from 'eventemitter3'

import Player from '../models/player'
import game from '../states/game'

import playerHandlers from './playerHandlers'
import enemyHandlers from './enemyHandlers'

const socket = io('http://localhost:4000')
// const socket = io('https://backend-service-wxtkngvfew.now.sh')

const playerObs = new EventEmitter()

const remotePlayers = []
const enemies = []


function setEventHandlers(){

  // trigger game start
  socket.emit('newPlayer', {x: game.startX, y: game.startY})

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






export {socket, setEventHandlers, playerObs}
