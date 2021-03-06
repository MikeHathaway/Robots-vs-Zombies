import {socket,playerObs} from './index'
import Player from '../models/player'
import game from '../states/game'

const remotePlayers = []


function onNewGame(data){
  console.log('new game data', data, game.startX, game.startY)
  sendNewPlayer(data,game)
}

function sendNewPlayer(data,game){
  return socket.emit('newPlayer', {x: game.startX, y: game.startY, id: data.id, gameID: data.gameID})
}


function onNewPlayer(data){
  console.log('New player connected:', data, remotePlayers)

  const duplicate = playerById(data.id)

  if (duplicate) {
    console.error('Duplicate player!')
    return
  }

  if(remotePlayers.length === 0){
    return localPlayer(game,data)
  }
  else if(remotePlayers.length > 0){
    const newPlayer = new Player(game,data.x,data.y,'frontRobot',100,5,game.weapons,data.id, data.gameID)
    remotePlayers.push(newPlayer)
    playerObs.emit('addPlayer', newPlayer)
  }
}

function localPlayer(game,data){
  const newPlayer = new Player(game,data.x,data.y,'frontRobot',100,5,game.weapons,data.id,data.gameID)
  playerObs.emit('addPlayer', newPlayer)
  remotePlayers.push(newPlayer)

  /** Add enemies if local player is only player in the game */
  socket.emit('newEnemies', {number: 5,x: game.startX, y: game.startY, gameID: data.gameID})
}


//http://examples.phaser.io/_site/view_full.html?d=arcade%20physics&f=angular+velocity.js&t=angular%20velocity)
function onMovePlayer(data){
  const movePlayer = playerById(data.id);
  movePlayer.body.rotation = data.rotation
  return movePlayer ? playerObs.emit('movingPlayer', {player: movePlayer, data: data}) : false
}


function movePlayerOperation(movePlayer){
  const player = movePlayer.player
  const tween = game.add.tween(player)
  tween.to({x: movePlayer.data.x,y:movePlayer.data.y}, 0) //formerly duration
  tween.start()
}


function onShoot(data){
  playerObs.emit('shootPlayer', {id: data.id, pid: data.pid, x: data.x, y: data.y, v: data.v, r: data.r, type: data.type})
}


function onPlayerAttacked(data){
  const attackedPlayer = playerById(data.id)

  attackedPlayer.health = data.health
  attackedPlayer.lives = data.lives

  if(attackedPlayer.lives === 0){
    remotePlayers.splice(remotePlayers.indexOf(attackedPlayer), 1)
  }
}



function onRemovePlayer(data){
  const removePlayer = playerById(data.playerID)

  if (!removePlayer) {
    console.error('Player (remove) not found: ', data.playerID)
    return
  }

  // removePlayer.kill() // unnecessary?
  playerObs.emit('removePlayer', removePlayer)
  remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1)
}

function onSocketDisconnect(){
  console.log('Disconnected from socket server')
}


function playerById (id) {
  const identifiedPlayer = remotePlayers.filter(player => player.id === id)
  return identifiedPlayer.length > 0 ? identifiedPlayer[0] : false
}

const playerHandlers = {onNewGame,onNewPlayer,localPlayer,onMovePlayer,onShoot,onRemovePlayer,onSocketDisconnect, remotePlayers, movePlayerOperation, onPlayerAttacked}
export default playerHandlers
