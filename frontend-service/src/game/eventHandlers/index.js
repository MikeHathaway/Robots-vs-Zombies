//http://www.dynetisgames.com/2017/03/06/how-to-make-a-multiplayer-online-game-with-phaser-socket-io-and-node-js/
//https://github.com/Jerenaux/basic-mmo-phaser/blob/master/js/client.js
//http://www.html5gamedevs.com/topic/29104-how-to-make-a-multiplayer-online-game-with-phaser-socketio-and-nodejs/

//https://gamedev.stackexchange.com/questions/124434/phaser-io-with-socket-io-what-should-the-server-calculate-and-what-the-client

//https://github.com/fbaiodias/phaser-multiplayer-game

//https://github.com/Langerz82/phasertanksmultiplayer

//https://github.com/crisu83/capthatflag/tree/feature/phaser-server

//http://www.gabrielgambetta.com/client-side-prediction-server-reconciliation.html

//https://socket.io/docs/using-multiple-nodes/

import io from 'socket.io-client'
import EventEmitter from 'event-emitter-es6'

import Player from '../models/player'
import game from '../game'

// let port = 'https://backend-service-ewbtarfvys.now.sh'
// if(process.env.ENVIRONMENT === 'development') port = 'https://localhost:4000'

//'http://localhost:4000'
const socket = io('http://localhost:4000')

const playerObs = new EventEmitter()

const remotePlayers = []
const enemies = []

function setEventHandlers(){

  socket.emit('test', {balls: 'balls'})

  // trigger game start
  socket.emit('newPlayer', {x: game.startX, y: game.startY})

  socket.on('connect', onSocketConnected)

  // Socket disconnection
  socket.on('disconnect', onSocketDisconnect)

  // New player message received
  socket.on('newPlayer', onNewPlayer)

  // add enemies to the game
  socket.on('newEnemies', onNewEnemies)

  // Player move message received
  socket.on('movePlayer', onMovePlayer)

  // Enemy move message received
  socket.on('moveEnemy', onMoveEnemy)

  socket.on('shoot', onShoot) //shootPlayer(data.id,data.pid,data.x,data.y,data.v,data.r,data.tr);

  socket.on('shot', onEnemyShot) //bulletHitPlayer(data);

  // Player removed message received
  socket.on('removePlayer', onRemovePlayer)

  socket.on('test', (data) => console.log('test', data))
}

function onSocketConnected(){
  console.log('player has joined the game')
  socket.emit('newPlayer', {x: game.startX, y: game.startY})
}


function onSocketDisconnect(){
  console.log('Disconnected from socket server')
}


function onNewPlayer(data){
  console.log('New player connected:', data)

  const duplicate = playerById(data.id)

  if (duplicate) {
    console.log('Duplicate player!')
    return
  }

  if(remotePlayers.length === 0){
    localPlayer(game,data)
  }
  else if(remotePlayers.length > 0){
    const newPlayer = new Player(game,data.x,data.y,'zombie',50,5,game.weapons,data.id)
    remotePlayers.push(newPlayer)
    playerObs.emit('addPlayer', newPlayer)
  }
}

function localPlayer(game,data){
  const newPlayer = new Player(game,data.x,data.y,'zombie',50,5,game.weapons,data.id)
  playerObs.emit('addPlayer', newPlayer)
  remotePlayers.push(newPlayer)
}


function onNewEnemies(data){
  console.log('new enemies to add!', data.enemyList)
  // enemies.push(data) <- make it game.enemies?
  playerObs.emit('addEnemies', data)
  data.enemyList.forEach(enemy => enemies.push(enemy))
}


function onMovePlayer(data){
  const movePlayer = playerById(data.id);
  return movePlayer ? playerObs.emit('movingPlayer', {player: movePlayer, data: data}) : false
}

//need to modify this to accept enemy collection
function onMoveEnemy(data){
  const moveEnemy = enemyById(data.id);
  // return moveEnemy ? playerObs.emit('movingEnemy', {enemy: moveEnemy, data: data}) : false

  if (!moveEnemy) {
      console.log("Enemy (move) not found: " + data.id);
      return;
  }

  console.log('move enemy received', moveEnemy, data)

  //need to reduce quantity of information being transported
  // playerObs.emit('movingEnemy', {enemy: moveEnemy, data: data})
  playerObs.emit('movingEnemy', {data: data})

}


function onShoot(data){
  playerObs.emit('shootPlayer', {id: data.id, pid: data.pid, x: data.x, y: data.y, v: data.v, r: data.r})
}

function onEnemyShot(data){
  console.log('enemy shot',data)
}


function onRemovePlayer(data){
  const removePlayer = playerById(data.id)

  if (!removePlayer) {
    console.log('Player (remove) not found: ', data.id)
    return
  }

  removePlayer.kill() // unnecessary?
  playerObs.emit('removePlayer', removePlayer)
  remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1)
  this.emit("removePlayer", {id: data.id})
}


function playerById (id) {
  const identifiedPlayer = remotePlayers.filter(player => player.id === id)
  return identifiedPlayer.length > 0 ? identifiedPlayer[0] : false
}

function enemyById (id) {
  const identifiedEnemy = enemies.filter(enemy => enemy.id === id)
  return identifiedEnemy.length > 0 ? identifiedEnemy[0] : false
}


export {socket, setEventHandlers, playerObs}
