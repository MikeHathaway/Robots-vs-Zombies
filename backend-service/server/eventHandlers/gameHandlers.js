const io = global._io
const Game = global._Game

const Player = require('../models/Player').Player
const Bullet = require('../models/Bullet').Bullet
const Enemy = require('../models/Enemy').Enemy

// const players = []
let numEnemies = 5

const gameWidth = 1200
const gameHeight = 1000

const gameSessions = Game.gameSessions

module.exports = {
  onNewPlayer,
  onNewEnemies,
  onMovePlayer,
  onMoveEnemy,
  onShoot,
  onEnemyHit,
  onPlayerAttacked,
  onWaveComplete
}

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
    return gameSessions[newPlayer.gameID].players.push(newPlayer);
  }

  else if(gameSessions[newPlayer.gameID].players.length < 4){
    console.log('joining existing game')
    io.sockets.in(roomID).emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), gameID: newPlayer.gameID})

    // send enemies if joining existing game
    io.sockets.in(roomID).emit('newEnemies', {enemyList: gameSessions[newPlayer.gameID].enemies, level: gameSessions[newPlayer.gameID].level})

    gameSessions[newPlayer.gameID].players.forEach(player => {
      this.in(roomID).emit('newPlayer', {id: player.id, x: player.getX(), y: player.getY(), gameID: newPlayer.gameID})
    })

    return gameSessions[newPlayer.gameID].players.push(newPlayer);
  }
}




function onNewEnemies(data){
  const currentGame = gameSessions[data.gameID.toString()]
  const roomID = data.gameID.toString()
  //ensure that enemies are only added once
  console.log('on new enemies called',data.number, currentGame)
  if(currentGame.enemies.length === 0){
    addEnemies(data)
    return io.sockets.in(roomID).emit('newEnemies', {enemyList: currentGame.enemies, level: currentGame.level})
  }
  else if(currentGame.enemies.length <= data.number){
    return io.sockets.in(roomID).emit('newEnemies', {enemyList: currentGame.enemies, level: currentGame.level})
  }
}

function addEnemies(data){
  let currentNum = 0
  while(currentNum++ < data.number){
    const xPos = randomInt(0,gameWidth)
    const yPos = randomInt(0,gameHeight)
    const newEnemy = new Enemy(Game.lastEnemyId, xPos, yPos)
    // const newEnemy = new Enemy(Game.lastEnemyId, randomInt(0,data.x), randomInt(0,data.y))
    newEnemy.gameID = data.gameID.toString()
    Game.lastEnemyId++
    gameSessions[data.gameID.toString()].enemies.push(newEnemy)
  }
}

function onMovePlayer(data) {
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

  socket.broadcast.to(roomID).emit("movePlayer", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), rotation: movePlayer.r})
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

    moveEnemy.setX(data.x)
    moveEnemy.setY(data.y)

    socket.broadcast.to(roomID).emit("movePlayer", {id: moveEnemy.id, x: moveEnemy.x, y: moveEnemy.y})
}

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

  hitEnemy.health -= data.damage

  if(hitEnemy.health <= 0){
    io.sockets.in(roomID).emit('enemyHit', {id: hitEnemy.id, health: 0, alive: false})
    return gameSessions[data.gameID].enemies.splice(gameSessions[data.gameID].enemies.indexOf(hitEnemy),1)

  }
  return io.sockets.in(roomID).emit('enemyHit', {id: hitEnemy.id, health: hitEnemy.health, alive: true, gameID: data.gameID})
}

function onPlayerAttacked(data){
  const attackedPlayer = playerById(data.id,data.gameID)
  const roomID = data.gameID.toString()

  if(!attackedPlayer) {
    console.log("Player (attacked) not found: " + data.id)
    return
  }

  attackedPlayer.health = data.health
  attackedPlayer.lives = data.lives

  if(attackedPlayer.health === 0 && attackedPlayer.lives === 0){
    return gameSessions[roomID].players.splice(gameSessions[roomID].player.indexOf(attackedPlayer),1)
  }

  return io.sockets.in(roomID).emit('playerAttacked', {id: attackedPlayer.id, health: attackedPlayer.health, lives: attackedPlayer.lives, gameID: roomID})
}


//new enemies appear to go through but not properly added
function onWaveComplete(data){
  const roomID = data.gameID

  if(gameSessions[roomID]){
    gameSessions[roomID].level += 1
    const nextWaveConfig = configureNextWave(roomID)
    addEnemies(nextWaveConfig)

    console.log('Wave Complete', data)

    io.sockets.in(roomID).emit('newEnemies', {enemyList: gameSessions[roomID].enemies, level: gameSessions[roomID].level})
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
