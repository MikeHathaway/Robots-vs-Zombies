const io = global._io

const Game = require('../models/Game')
const Player = require('../models/Player').Player
const Bullet = require('../models/Bullet').Bullet
const Enemy = require('../models/Enemy').Enemy

const players = []
const bullets = []
const enemies = []

const game = {} // <- will be a reference to the server side headless phaser
game.lastEnemyId = 0
game.lastPlayerId = 0

//https://www.npmjs.com/package/node-pathfinding
// ^node pathfinder


module.exports = {
  onNewPlayer,
  onNewEnemies,
  onMovePlayer,
  onMoveEnemy,
  onShoot,
  onEnemyHit,
  onSocketDisconnect
}



function onNewPlayer(data) {
  const newPlayer = new Player(data.x, data.y)
  newPlayer.id = this.id

  console.log('new played added: ', this.id)

  //first player in new game
  if(players.length === 0){
    console.log('emitting through new player')
    io.sockets.emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

    players.forEach(player => {
      this.emit('newPlayer', {id: player.id, x: player.getX(), y: player.getY()})
    })

    return players.push(newPlayer);
  }
  //existing game
  else if(players.length !== 0){// && enemies.length === 0){
    console.log('second condition!')
    io.sockets.emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

    // send enemies if joining existing game
    io.sockets.emit('newEnemies', {enemyList: enemies})

    players.forEach(player => {
      this.emit('newPlayer', {id: player.id, x: player.getX(), y: player.getY()})
    })

    return players.push(newPlayer);
  }

  // //restarting game
  // else {
  //   console.log('else case',this)
  //   io.sockets.emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})
  //   // this.broadcast.to(this.id).emit('newEnemies', {enemyList: enemies})
  //   io.sockets.emit('newEnemies', {enemyList: enemies})
  // }
}


function onNewEnemies(data){
  //ensure that enemies are only added once
  console.log('on new enemies called', enemies.length,data.number)
  if(enemies.length === 0){
    console.log('first player enemies!')
    addEnemies(data)
    return io.sockets.emit('newEnemies', {enemyList: enemies})
  }
  else if(enemies.length <= data.number){
    return io.sockets.emit('newEnemies', {enemyList: enemies})
  }
}

function addEnemies(data){
  let currentNum = 0
  console.log(data, game.lastEnemyId)
  while(currentNum++ < data.number){
    const newEnemy = new Enemy(game.lastEnemyId, randomInt(0,data.x), randomInt(0,data.y))
    game.lastEnemyId++
    enemies.push(newEnemy)
  }
}

function onMovePlayer(data) {
  const movePlayer = playerById(data.id);

  if (!movePlayer) {
      console.log("Player not found: " + data.id)
      return
  }
  console.log('moving player: ', data.id, data.x)

  movePlayer.setX(data.x)
  movePlayer.setY(data.y)

  this.broadcast.emit("movePlayer", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
}


function onMoveEnemy(data){
  const moveEnemy = enemyById(data.id)

  if (!moveEnemy) {
      console.log("Enemy (move) not found: " + data.id)
      return
  }

  const enemyRange = moveEnemy.speed * 100

  const target = decideToMove(moveEnemy,enemyRange)

  if(target !== -1){
    identifyNextPosition(moveEnemy,enemyRange,players[target])

    io.volatile.sockets.emit('moveEnemy', {id: moveEnemy.id, x: moveEnemy.x, y: moveEnemy.y})
  }
}

// && check that they are also within y range
function identifyNextPosition(enemy, enemyRange,player){
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
function decideToMove(enemy, enemyRange){
  for(let i = 0; i < players.length; i++){
    if(
      Math.floor(enemy.x) - Math.floor(players[i].getX()) < enemyRange ||
      Math.floor(enemy.y) - Math.floor(players[i].getY()) < enemyRange
       ){
        //console.log('true')
       return i
     }
      return -1
  }
}


function onShoot(data){
  const bulletType = data.type
  console.log(data.id, ' is shooting!', bulletType)
  const bullet = new Bullet(Object.keys(bullets).length, data.id, data.x, data.y, data.v, data.r, bulletType)
  bullets.push(bullet)

  // this.volatile.broadcast.emit('shoot', bullet)
  // this.volatile.emit('shoot', bullet)
  // this.broadcast.emit('shoot', bullet)
  io.sockets.emit('shoot', bullet)
}


function resetBullets(){

}


function onEnemyHit(data){
  const hitEnemy = enemyById(data.id)

  if (!hitEnemy) {
      console.log("Enemy (move) not found: " + data.id)
      return
  }

  console.log('ENEMY HIT!!!!!!',hitEnemy.health, data.damage)

  hitEnemy.health -= data.damage

  if(hitEnemy.health <= 0){
    io.sockets.emit('enemyHit', {id: hitEnemy.id, health: 0, alive: false})
    return enemies.splice(enemies.indexOf(hitEnemy),1)
  }
  return io.sockets.emit('enemyHit', {id: hitEnemy.id, health: hitEnemy.health, alive: true})
}


function onSocketDisconnect() {
  console.log("Player has disconnected: " + this.id)

  const removePlayer = playerById(this.id)
  if (!removePlayer) {
      console.log("Player not found: " + this.id)
      return
  }

  this.broadcast.emit('removePlayer', {id: removePlayer.id})
  players.splice(players.indexOf(removePlayer), 1)
}





/* =============== =============== ===============

 =============== HELPER FUNCTIONS ===============

 =============== =============== =============== */


function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

function playerById (id) {
  const identifiedPlayer = players.filter(player => player.id === id)
  return identifiedPlayer.length > 0 ? identifiedPlayer[0] : false
}

function enemyById (id) {
  const identifiedEnemy = enemies.filter(enemy => enemy.id === id)
  return identifiedEnemy.length > 0 ? identifiedEnemy[0] : false
}
