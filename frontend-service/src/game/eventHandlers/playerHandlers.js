import {socket,playerObs} from './index'
import Player from '../models/player'
import game from '../states/game'

const remotePlayers = []


function onNewPlayer(data){
  console.log('New player connected:', data, remotePlayers)

  const duplicate = playerById(data.id)

  if (duplicate) {
    console.log('Duplicate player!')
    return
  }

  if(remotePlayers.length === 0){
    return localPlayer(game,data)
  }
  else if(remotePlayers.length > 0){
    const newPlayer = new Player(game,data.x,data.y,'Zombie_Sprite',50,5,game.weapons,data.id)
    remotePlayers.push(newPlayer)
    playerObs.emit('addPlayer', newPlayer)
    console.log('a remote player!', newPlayer.id)
    //playerObs.emit('addRemotePlayer', newPlayer)
  }
}

function localPlayer(game,data){
  const newPlayer = new Player(game,data.x,data.y,'Zombie_Sprite',50,5,game.weapons,data.id)
  playerObs.emit('addPlayer', newPlayer)
  remotePlayers.push(newPlayer)
  console.log('first player!')

  /** Add enemies if local player is only player in the game */
  socket.emit('newEnemies', {number: 5,x: game.startX, y: game.startY})
}


function onMovePlayer(data){
  const movePlayer = playerById(data.id);
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



//clear player data
// playerObs.on('newGame', () => {
//   console.log('starting new game')
//   remotePlayers.length = 0
// })


function onRemovePlayer(data){
  const removePlayer = playerById(data.id)

  if (!removePlayer) {
    console.log('Player (remove) not found: ', data.id)
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

const playerHandlers = {onNewPlayer,localPlayer,onMovePlayer,onShoot,onRemovePlayer,onSocketDisconnect, remotePlayers, movePlayerOperation}
export default playerHandlers
