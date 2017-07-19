import EventEmitter from 'eventemitter3'

import Player from '../models/player'
import game from '../states/game'

import playerHandlers from './playerHandlers'
import enemyHandlers from './enemyHandlers'

const playerObs = new EventEmitter()

const remotePlayers = []
const enemies = []


const deepstream = require('deepstream.io-client-js')

//should rename this to 'client'
const client = deepstream('localhost:5000')

client.on('error', (err) => console.error(err))

client.login({}, (success) => {
  console.log('Deepstream login successful: ',success)
})

const enemyRecord = client.record.getRecord('enemies')
enemyRecord.subscribe('enemy', (data) => {
  console.log(data)
})



function setEventHandlers(){

  // trigger game start
  client.event.emit('newPlayer', {x: game.startX, y: game.startY})


  /** PLAYER EVENTS */

  // New player message received
  client.event.subscribe('newPlayer', playerHandlers.onNewPlayer)

  // Player move message received
  client.event.subscribe('movePlayer', playerHandlers.onMovePlayer)

  //shootPlayer(data.id,data.pid,data.x,data.y,data.v,data.r,data.tr);
  client.event.subscribe('shoot', playerHandlers.onShoot)

  // Player removed message received
  client.event.subscribe('removePlayer', playerHandlers.onRemovePlayer)

  // Socket disconnection
  client.event.subscribe('disconnect', playerHandlers.onSocketDisconnect)


  /** ENEMY EVENTS */

  // add enemies to the game
  client.event.subscribe('newEnemies', enemyHandlers.onNewEnemies)

  // Enemy move message received
  client.event.subscribe('moveEnemy', enemyHandlers.onMoveEnemy)

  //bulletHitPlayer(data);
  client.event.subscribe('enemyHit', enemyHandlers.onEnemyHit)

  client.event.subscribe('test', (data) => console.log('test', data))
}



export {client, setEventHandlers, playerObs}
