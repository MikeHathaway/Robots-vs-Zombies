const io = global._io
const Game = global._Game


const Player = require('../models/Player').Player
const Bullet = require('../models/Bullet').Bullet
const Enemy = require('../models/Enemy').Enemy

const players = []
let numEnemies = 5

const gameWidth = 1200
const gameHeight = 1000

//enable pathfinding
const PF = require('pathfinding')
const grid = new PF.Grid(gameWidth,gameHeight)

const finder = new PF.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: true
})

// const finder = new PF.AStarFinder()

const gameSessions = Game.gameSessions

//https://www.codementor.io/codementorteam/socketio-multi-user-app-matchmaking-game-server-2-uexmnux4p

//https://www.npmjs.com/package/node-pathfinding
// ^node pathfinder


module.exports = {
  onNewPlayer,
  onNewEnemies,
  onMovePlayer,
  onMoveEnemy,
  onShoot,
  onEnemyHit,
  onWaveComplete,
  onSocketDisconnect
}


//identify the proper game room --roomID
//io.sockets.in()

function onNewPlayer(data) {
  const newPlayer = new Player(data.x, data.y)
  newPlayer.id = data.id
  newPlayer.gameID = data.gameID.toString()
  const roomID = newPlayer.gameID

  console.log('on new player', roomID, gameSessions, gameSessions[newPlayer.gameID])

  //first player in new game
  if(gameSessions[newPlayer.gameID].players.length === 0){
    console.log('first player in game', gameSessions)
    io.sockets.in(roomID).emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), gameID: newPlayer.gameID})
    // return placeNewPlayer(newPlayer)
    return gameSessions[newPlayer.gameID].players.push(newPlayer);
  }

  //existing game - make sure all players are in sync with eachother
  else if(gameSessions[newPlayer.gameID].players.length < 4){
    console.log('joining existing game')
    //console.log('joining existing game', gameSessions[newPlayer.gameID])
    io.sockets.in(roomID).emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), gameID: newPlayer.gameID})

    // send enemies if joining existing game
    io.sockets.in(roomID).emit('newEnemies', {enemyList: gameSessions[newPlayer.gameID].enemies})

    gameSessions[newPlayer.gameID].players.forEach(player => {
      this.in(roomID).emit('newPlayer', {id: player.id, x: player.getX(), y: player.getY(), gameID: newPlayer.gameID})
    })

    // return placeNewPlayer(newPlayer)
    return gameSessions[newPlayer.gameID].players.push(newPlayer);
  }
}




function onNewEnemies(data){
  const currentGame = gameSessions[data.gameID.toString()]
  const roomID = data.gameID.toString()
  //ensure that enemies are only added once
  console.log('on new enemies called',data.number)
  if(currentGame.enemies.length === 0){
    addEnemies(data)
    return io.sockets.in(roomID).emit('newEnemies', {enemyList: currentGame.enemies})
  }
  else if(currentGame.enemies.length <= data.number){
    return io.sockets.in(roomID).emit('newEnemies', {enemyList: currentGame.enemies})
  }
}

function addEnemies(data){
  let currentNum = 0
  console.log(data, Game.lastEnemyId)
  while(currentNum++ < data.number){
    const newEnemy = new Enemy(Game.lastEnemyId, randomInt(0,data.x), randomInt(0,data.y))
    newEnemy.gameID = data.gameID.toString()
    Game.lastEnemyId++
    gameSessions[data.gameID.toString()].enemies.push(newEnemy)
  }
}

function onMovePlayer(data) {
  console.log('move player received')
  const movePlayer = playerById(data.id,data.gameID)
  const roomID = data.gameID.toString()

  const socket = this

  if (!movePlayer) {
      console.log("Player not found: " + data.id)
      return
  }

  movePlayer.setX(data.x)
  movePlayer.setY(data.y)

  movePlayer.r = data.rotation

  //need to broadcast.emit this one
  // io.sockets.in(roomID).emit("movePlayer", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
  socket.broadcast.to(roomID).emit("movePlayer", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), rotation: movePlayer.r})
  // io.sockets.in(roomID).broadcast.emit("movePlayer", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
}


//update enemy position with latest information
function onMoveEnemy(data){
    const moveEnemy = enemyById(data.id,data.gameID) //send gameID as well
    const roomID = data.gameID.toString()
    const socket = this

    if (!moveEnemy) {
        console.log("Enemy not found: " + data.id)
        return
    }
    
    console.log('moving enemy!')

    moveEnemy.setX(data.x)
    moveEnemy.setY(data.y)

    socket.broadcast.to(roomID).emit("movePlayer", {id: moveEnemy.id, x: moveEnemy.x, y: moveEnemy.y})
}

//https://github.com/qiao/PathFinding.js
//https://github.com/prettymuchbryce/easystarjs
// function onMoveEnemy(data){
//   const moveEnemy = enemyById(data.id,data.gameID) //send gameID as well
//   const roomID = data.gameID.toString()
//
//   if (!moveEnemy) {
//       // console.log("Enemy (move) not found: " + data.id)
//       return
//   }
//
//   // const gridClone = grid.clone()
//
//   const enemyRange = moveEnemy.speed * 60
//   const target = identifyTarget(moveEnemy)
//
//   //console.log('PATH COORDINATES',moveEnemy.x, moveEnemy.y, target.getX(),target.getY())
//
//   if(target.getX() < gameWidth - 100 && target.getY() < gameHeight - 100){
//     const path = finder.findPath(Math.floor(moveEnemy.x), Math.floor(moveEnemy.y), Math.floor(target.getX()), Math.floor(target.getY()), grid)
//     if(path[3]){
//       console.log('place to move', path[0][0], path[0][1])
//       io.sockets.in(roomID).emit('moveEnemy', {id: moveEnemy.id, x: path[3][0], y: path[3][1]})
//     }
//   }
// }
//
//
// function identifyTarget(enemy){
//   const gamePlayers = gameSessions[enemy.gameID].players
//   return gamePlayers[0]
// }
//
//
// function movementInterval(){
//   return setInterval()
// }
//
//
// function decideToMove(enemy, enemyRange){
//   const gamePlayers = gameSessions[enemy.gameID].players
//   // console.log('TARGET',gamePlayers[0])
//   return gamePlayers[0]
//   // for(let i = 0; i < gamePlayers.length; i++){
//   //   if(
//   //     Math.floor(enemy.x) - Math.floor(gamePlayers[i].getX()) < enemyRange ||
//   //     Math.floor(enemy.y) - Math.floor(gamePlayers[i].getY()) < enemyRange
//   //      ){
//   //       //console.log('true')
//   //      return gamePlayers[i]
//   //    }
//   //     return -1
//   // }
// }

// function onMoveEnemy(data){
//   const moveEnemy = enemyById(data.id,data.gameID) //send gameID as well
//   const roomID = data.gameID.toString()
//
//   if (!moveEnemy) {
//       // console.log("Enemy (move) not found: " + data.id)
//       return
//   }
//
//   const enemyRange = moveEnemy.speed * 60
//
//   const target = decideToMove(moveEnemy,enemyRange)
//
//   if(target !== -1){
//     identifyNextPosition(moveEnemy,enemyRange,gameSessions[moveEnemy.gameID].players[target])
//     io.sockets.in(roomID).emit('moveEnemy', {id: moveEnemy.id, x: moveEnemy.x, y: moveEnemy.y})
//   }
// }



// && check that they are also within y range
function identifyNextPosition(enemy,enemyRange,player){
  if(Math.floor(Math.random() * 2) === 1){
    // enemy.isMoving = true
    if((Math.floor(enemy.x) - Math.floor(player.getX())) < enemyRange) return enemy.x += enemy.speed
    if((Math.floor(enemy.x) + Math.floor(player.getX())) > enemyRange) return enemy.x -= enemy.speed
  }
  else {
    // enemy.isMoving = true
    if((Math.floor(enemy.y) - Math.floor(player.getY())) < enemyRange) return enemy.y += enemy.speed
    if((Math.floor(enemy.y) + Math.floor(player.getY())) > enemyRange) return enemy.y -= enemy.speed
  }
}

// && enemy.isMoving === false <- check that enemy isn't already moving
// function decideToMove(enemy, enemyRange){
//   const gamePlayers = gameSessions[enemy.gameID].players
//   for(let i = 0; i < gamePlayers.length; i++){
//     if(
//       Math.floor(enemy.x) - Math.floor(gamePlayers[i].getX()) < enemyRange ||
//       Math.floor(enemy.y) - Math.floor(gamePlayers[i].getY()) < enemyRange
//        ){
//         //console.log('true')
//        return i
//      }
//       return -1
//   }
// }

let bulletPID = 0

//add additional keys??
function onShoot(data){
  const bulletType = data.type
  const roomID = data.gameID.toString()

  //resetting bullets before it reaches 120
  if(bulletPID === 119){
    bulletPID = 0
    //need to reset the bullet object as well so that it doesnt just grow infinetly
    const bullet = new Bullet(bulletPID, data.id, data.x, data.y, data.v, data.r, bulletType)
    bullet.gameID = data.gameID
    gameSessions[roomID].bullets.push(bullet)
    io.sockets.in(roomID).emit('shoot', bullet)
  }
  else{
    const bullet = new Bullet(bulletPID, data.id, data.x, data.y, data.v, data.r, bulletType)
    bulletPID++
    bullet.gameID = data.gameID
    gameSessions[roomID].bullets.push(bullet)
    io.sockets.in(roomID).emit('shoot', bullet)
  }
}


function onEnemyHit(data){
  const hitEnemy = enemyById(data.id,data.gameID)
  const roomID = data.gameID.toString()

  if (!hitEnemy) {
      console.log("Enemy (move) not found: " + data.id)
      return
  }

  console.log('ENEMY HIT!!!!!!',hitEnemy.health, data.damage)

  hitEnemy.health -= data.damage

  if(hitEnemy.health <= 0){
    io.sockets.in(roomID).emit('enemyHit', {id: hitEnemy.id, health: 0, alive: false})
    return gameSessions[data.gameID].enemies.splice(gameSessions[data.gameID].enemies.indexOf(hitEnemy),1)

  }
  return io.sockets.in(roomID).emit('enemyHit', {id: hitEnemy.id, health: hitEnemy.health, alive: true, gameID: data.gameID})
}


// ADD GAME ID to socket disconnect
function onSocketDisconnect(){
  console.log("Player has disconnected: " + this.id, this.rooms)
  const socket = this

  //socket.rooms should provide access to the current sockets room
  setTimeout(() => console.log(socket.rooms),10000)

  const removePlayer = playerById(this.id)

  if (!removePlayer) {
      console.log("Player not found: " + this.id)
      return
  }

  //socket.broadcast.to(roomID).emit('removePlayer', {id: removePlayer.id})
  this.broadcast.emit('removePlayer', {id: removePlayer.id})
  players.splice(players.indexOf(removePlayer), 1)
}






//new enemies appear to go through but not properly added
function onWaveComplete(data){
  const roomID = data.gameID

  if(gameSessions[roomID]){
    gameSessions[roomID].level += 1
    const nextWaveConfig = configureNextWave(roomID)
    addEnemies(nextWaveConfig)

    console.log('Wave Complete', data)

    io.sockets.in(roomID).emit('newEnemies', {enemyList: gameSessions[roomID].enemies, message: `LEVEL ${gameSessions[roomID].level}`})
  }
}

function configureNextWave(roomID){
  const numberOfEnemies = gameSessions[roomID].level
  // gameWidth && gameHeight var for x and y
  return {number: numberOfEnemies, x: 400, y: 400, gameID: roomID}
}






/* =============== =============== ===============

 =============== HELPER FUNCTIONS ===============

 =============== =============== =============== */


function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

function playerById (id,gameID) {
  if(gameSessions[gameID]){
    const identifiedPlayer = gameSessions[gameID].players.filter(player => player.id === id)
    return identifiedPlayer.length > 0 ? identifiedPlayer[0] : false
  }
  console.error('Game session not properly defined - player')
}

function enemyById (id,gameID) {
  if(gameSessions[gameID]){
    const identifiedEnemy = gameSessions[gameID].enemies.filter(enemy => enemy.id === id)
    return identifiedEnemy.length > 0 ? identifiedEnemy[0] : false
  }
  console.error('Game session not properly defined - enemy')
}
