//http://www.dynetisgames.com/2017/03/06/how-to-make-a-multiplayer-online-game-with-phaser-socket-io-and-node-js/
//https://github.com/Jerenaux/basic-mmo-phaser/blob/master/js/client.js

//https://gamedev.stackexchange.com/questions/124434/phaser-io-with-socket-io-what-should-the-server-calculate-and-what-the-client

//https://github.com/fbaiodias/phaser-multiplayer-game

//http://rawkes.com/articles/creating-a-real-time-multiplayer-game-with-websockets-and-node.html

import io from 'socket.io-client'
import Player from '../player'

import game from '../game'

const socket = io('http://localhost:4000')

function setEventHandlers(){
  window.socket = socket

  socket.emit('newPlayer', {x: game.startX, y: game.startY})
  console.log(game.startX)

  // Socket connection successful
  socket.on('connection', onSocketConnected)

  // Socket disconnection
  socket.on('disconnect', onSocketDisconnect)

  // New player message received
  socket.on('newPlayer', onNewPlayer)

  // Player move message received
  socket.on('movePlayer', onMovePlayer)

  // Player removed message received
  socket.on('removePlayer', onRemovePlayer)
}


/* currently non functional */
function onSocketConnected() {
  console.log("Connected to socket server")
  socket.emit('newPlayer', {x: game.localPlayer.x, y: game.localPlayer.y})
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

  localPlayer(game,data)
}

function localPlayer(game,data){
  const newPlayer = new Player(game,32,game.world.height / 2,'zombie',50,5,game.weapons,data.id)
  game.add.sprite(newPlayer.x, newPlayer.y, newPlayer.avatar)
  game.allPlayers.push(newPlayer)
  game.localPlayer = newPlayer
  return newPlayer
}

function onMovePlayer(data){
  // console.log('??', game.localPlayer.id, data)
  const movePlayer = playerById(data.id);

  if (!movePlayer) {
      console.log("Player not found: " + data.id);
      return;
  }

  // movePlayer.x = data.x
  // movePlayer.y = data.y
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

  removePlayer.kill()
  game.allPlayers.splice(game.allPlayers.indexOf(removePlayer), 1)
  this.broadcast.emit("removePlayer", {id: data.id})
}



function playerById (id) {
  const identifiedPlayer = game.allPlayers.filter(player => player.id === id)
  return identifiedPlayer.length > 0 ? identifiedPlayer[0] : false
}

export {socket, setEventHandlers}
