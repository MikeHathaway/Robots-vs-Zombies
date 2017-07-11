//http://www.dynetisgames.com/2017/03/06/how-to-make-a-multiplayer-online-game-with-phaser-socket-io-and-node-js/
//https://github.com/Jerenaux/basic-mmo-phaser/blob/master/js/client.js

//https://gamedev.stackexchange.com/questions/124434/phaser-io-with-socket-io-what-should-the-server-calculate-and-what-the-client

//https://github.com/fbaiodias/phaser-multiplayer-game

//http://rawkes.com/articles/creating-a-real-time-multiplayer-game-with-websockets-and-node.html

//https://github.com/crisu83/capthatflag/tree/feature/phaser-server

import io from 'socket.io-client'
import EventEmitter from 'event-emitter-es6'

import Player from '../player'
import game from '../game'

const socket = io('http://localhost:4000')

const playerObs = new EventEmitter()

const remotePlayers = []

function setEventHandlers(){

  socket.emit('newPlayer', {x: game.startX, y: game.startY})

  socket.on('connect', onSocketConnected)

  // Socket disconnection
  socket.on('disconnect', onSocketDisconnect)

  // New player message received
  socket.on('newPlayer', onNewPlayer)

  // Player move message received
  socket.on('movePlayer', onMovePlayer)

  // Player removed message received
  socket.on('removePlayer', onRemovePlayer)
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

function onMovePlayer(data){
  const movePlayer = playerById(data.id);

  if (!movePlayer) {
      console.log("Player not found: " + data.id);
      return;
  }

  movePlayer.body.x = data.x
  movePlayer.body.y = data.y
}


function onRemovePlayer(data){
  const removePlayer = playerById(data.id)

  // Player not found
  if (!removePlayer) {
    console.log('Player not found: ', data.id)
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


export {socket, setEventHandlers, playerObs}
