const Game = require('./models/Game')
const Player = require('./models/Player').Player
const Bullet = require('./models/Bullet').Bullet
const Enemy = require('./models/Enemy').Enemy

const players = []
const bullets = []
const enemies = []

const game = {} // <- will be a reference to the server side headless phaser
game.lastEnemyId = 0
game.lastPlayerId = 0

const deepstream = require('deepstream.io-client-js')
const client = deepstream('localhost:5000')



client.on('error', (err) => console.error(err))

client.login({}, (success) => setEventHandlers(client))

// setEventHandlers(client)


const userMap = {}
let lastUserId = 0

const userRecord = client.record.getRecord('user')


userRecord.set('user', {x: 1000, y: 800})

const enemyRecord = client.record.getRecord('enemies')
enemyRecord.set('enemy', {test: 'test'})



function setEventHandlers(client){
  gSocket = client
  console.log('connected!')
  client.event.subscribe('newPlayer', onNewPlayer)
  client.event.subscribe('newEnemies', onNewEnemies)
  // client.event.subscribe('movePlayer', onMovePlayer)
  client.event.subscribe('moveEnemy', onMoveEnemy)
  client.event.subscribe('shoot', onShoot)
  client.event.subscribe('enemyHit', onEnemyHit)
  client.event.subscribe('disconnect', onSocketDisconnect)
  client.event.subscribe('test', (data) => { console.log(data)})
}


function onNewPlayer(data) {
  console.log('new player??', data)
  const newPlayer = new Player(data.x, data.y)
  newPlayer.id = game.lastPlayerId
  game.lastPlayerId++

  players.push(newPlayer)

  if(players.length === 1){
    return client.event.emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})
  }
  else if(players.length >= 1 && enemies.length === 0){

    // add new player sprite
    client.event.emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

    // add sprites for existing players
    players.forEach(player => {
      client.event.emit('newPlayer', {id: player.id, x: player.getX(), y: player.getY()})
    })

    // send enemies if joining existing game
    return client.event.emit('newEnemies', {enemyList: enemies})
  }
}


function onNewEnemies(data){
  //ensure that enemies are only added once
  console.log('on new enemies called', enemies.length,data.number)
  if(enemies.length === 0){
    console.log('first player enemies!')
    addEnemies(data)
    return client.event.emit('newEnemies', {enemyList: enemies})
  }
  else if(enemies.length <= data.number){
    return client.event.emit('newEnemies', {enemyList: enemies})
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

// function onMovePlayer(data) {
//   const movePlayer = playerById(data.id);
//
//   if (!movePlayer) {
//       console.log("Player not found: " + data.id)
//       return
//   }
//   console.log('moving player: ', data.id, data.x)
//
//
//   movePlayer.setX(data.x)
//   movePlayer.setY(data.y)
//
//   // userRecord.set('movePlayer', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
//   client.event.emit("movePlayer", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
// }


/** MOVE PLAYER OPERATION */
//'user/movePlayer' add specific id to the move player
userRecord.subscribe('user/movePlayer', movePlayerPosition)

function movePlayerPosition(data){
  console.log('resetting position', data)
  const movePlayer = playerById(data.id);

  if(!movePlayer) return

  movePlayer.setX(data.x)
  movePlayer.setY(data.y)

  //holderover for other clients to see movement
  // client.event.emit("movePlayer", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
}

/** MOVE ENEMY OPERATION */
// enemyRecord.subscribe('enemy/moveEnemy', moveEnemyPosition)
//
// function moveEnemyPosition(data){
//   const moveEnemy = enemyById(data.id)
//
//   if(!moveEnemy) return
//
//   moveEnemy.setX(data.x)
//   moveEnemy.setY(data.x)
//
//   client.event.emit("moveEnemy", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
// }


function onMoveEnemy(data){
  const moveEnemy = enemyById(data.id)

  if (!moveEnemy) {
      console.log("Enemy (move) not found: " + data.id)
      return
  }

  const enemyRange = moveEnemy.speed * 15

  const target = decideToMove(moveEnemy,enemyRange)

  if(target !== -1){
    identifyNextPosition(moveEnemy,enemyRange,players[target])

    client.event.emit('moveEnemy', {id: moveEnemy.id, x: moveEnemy.x, y: moveEnemy.y})
  }
}

// && check that they are also within y range
function identifyNextPosition(enemy, enemyRange,player){
  if(Math.floor(Math.random() * 2) === 1){
    if((Math.floor(enemy.x) - Math.floor(player.getX())) < enemyRange) return enemy.x += enemy.speed
    if((Math.floor(enemy.x) + Math.floor(player.getX())) > enemyRange) return enemy.x -= enemy.speed
  }
  else {
    if((Math.floor(enemy.y) - Math.floor(player.getY())) < enemyRange) return enemy.y += enemy.speed
    if((Math.floor(enemy.y) + Math.floor(player.getY())) > enemyRange) return enemy.y -= enemy.speed
  }
}

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
  console.log(data.id, ' is shooting!')
  const bullet = new Bullet(Object.keys(bullets).length, data.id, data.x, data.y, data.v, data.r);
  bullets.push(bullet);

  //client.event.broadcast.emit
  client.event.emit('shoot', bullet);
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
    client.event.emit('enemyHit', {id: hitEnemy.id, health: 0, alive: false})
    return enemies.splice(enemies.indexOf(hitEnemy),1)
  }
  return client.event.emit('enemyHit', {id: hitEnemy.id, health: hitEnemy.health, alive: true})
}


function onSocketDisconnect() {
  console.log("Player has disconnected: " + this.id)

  const removePlayer = playerById(this.id)
  if (!removePlayer) {
      console.log("Player not found: " + this.id)
      return
  }

  client.event.emit('removePlayer', {id: removePlayer.id})
  players.splice(players.indexOf(removePlayer), 1)
}



function playerById (id) {
  const identifiedPlayer = players.filter(player => player.id === id)
  return identifiedPlayer.length > 0 ? identifiedPlayer[0] : false
}

function enemyById (id) {
  const identifiedEnemy = enemies.filter(enemy => enemy.id === id)
  return identifiedEnemy.length > 0 ? identifiedEnemy[0] : false
}

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

module.exports =  {
  bullets,
  enemies
}
