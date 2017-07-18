//http://www.dynetisgames.com/2017/03/06/how-to-make-a-multiplayer-online-game-with-phaser-socket-io-and-node-js/
//https://github.com/Jerenaux/basic-mmo-phaser/blob/master/js/client.js
//http://www.html5gamedevs.com/topic/29104-how-to-make-a-multiplayer-online-game-with-phaser-socketio-and-nodejs/

//https://gamedev.stackexchange.com/questions/124434/phaser-io-with-socket-io-what-should-the-server-calculate-and-what-the-client

//https://github.com/fbaiodias/phaser-multiplayer-game

//https://github.com/Langerz82/phasertanksmultiplayer

//https://github.com/crisu83/capthatflag/tree/feature/phaser-server

//http://www.gabrielgambetta.com/client-side-prediction-server-reconciliation.html

//https://socket.io/docs/using-multiple-nodes/

//https://github.com/cujojs/most-w3msg

import io from 'socket.io-client'

import EventEmitter from 'event-emitter-es6'

import Player from '../models/player'
import game from '../states/game'

import playerHandlers from './playerHandlers'
import enemyHandlers from './enemyHandlers'

// const socket = io('http://localhost:4000')
const socket = io('https://backend-service-hnhzyecwxb.now.sh')

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
