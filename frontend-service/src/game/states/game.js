/* ----- Model Dependencies ----- */
import Bullet from '../models/bullet'
import {SingleBullet, LazerBeam, HeartGun} from '../models/weapon'
import Enemy from '../models/enemy'
import Player from '../models/player'


/* ----- State Dependencies ----- */
import CivZombie from '../main'

/* ----- Server Dependencies ----- */
import {socket, setEventHandlers, playerObs} from '../eventHandlers'
import enemyHandlers from '../eventHandlers/enemyHandlers'
import playerHandlers from '../eventHandlers/playerHandlers'



  /* ----- PHaser Global Variables ----- */
  let map
    , layer
    , players
    , cursors
    , controls
    , fireButton
    , changeKey
    , collisionLayer
    , enemies
    , bullets
    , weapons
    , localPlayer

  const gameWidth = 1000
  const gameHeight = 800
  const enemyMap = []
  const numEnemies = 15

  const globalGameID = []
  let currentWave = 0
  let enemiesAdded = false // make sure waves dont start excessively

  /* ----- Start Game Instance ----- */
  const game = {
    init: init,
    preload: preload,
    create: create,
    update: update,
    render: render
  }

  function init(){
    game.stage.disableVisibilityChange = true
  }

  function preload(){
    game.load.crossOrigin = 'anonymous'

    game.load.tilemap('desert', './assets/tilemaps/desert.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.tilemap('forest', './assets/tilemaps/forest.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.image('forestTiles', './assets/tilemaps/trees-and-bushes.png')
    game.load.image('tiles', './assets/tilemaps/tmw_desert_spacing.png')

    game.load.image('frontRobot', './assets/frontRobot.png') // frontRobot for smaller version
    game.load.image('backRobot', './assets/backRobot.png') //Zombie_Sprite CZombie

    game.load.image('zombie', './assets/CZombieMini.png') //Zombie_Sprite CZombie
    game.load.image('Zombie_Sprite', './assets/Zombie_Sprite.png') //Zombie_Sprite CZombie
    game.load.image('bullet', './assets/singleBullet.png')
    game.load.image('lazer', './assets/lazer.png')
    game.load.image('heart', './assets/heart.png')
    game.load.spritesheet('zombies', './assets/zombie_sheet.png', 32, 48)

    game.load.spritesheet('zombieAttack', './assets/zombieSheet1.png', 64, 64) // [32,48] //zombies seem to be too big
  }

  function create(){
    configureGame()

    addMap('desert') // specify map can be: ['desert', 'forest']
    addEnemies(numEnemies) //specify number of enemies to be added
    addWeapons()
    addPlayerGroup()
    addScore() // Score animations
    addInputs() // Add game controls

    setEventHandlers() // Start listening for events

    enemyHandlers.addRemoteEnemies()
  }

  function update(){
    if (localPlayer) checkPlayerInputs(localPlayer)
    if (localPlayer) checkCollisions()
    if (localPlayer && enemies) checkGameOver()
    if (localPlayer && enemies) checkEnemyActions()
    if (localPlayer && enemies) checkWaveComplete()

    checkScore()
  }

  /** Global Event Listeners*/
  playerObs.on('removePlayer', removeOperations)
  playerObs.on('movingPlayer', playerHandlers.movePlayerOperation)
  playerObs.on('shootPlayer', shootOperation)
  playerObs.on('movingEnemy', enemyHandlers.moveEnemyOperation)
  playerObs.on('addPlayer', addPlayersToGame)
  playerObs.on('enemyGroup',addEnemiesToGroup)
  playerObs.on('error', errorHandler)


  function render(){
	   if (localPlayer) this.game.debug.text("Player Health: " + localPlayer.health + " / " + localPlayer.maxHealth, 32, 32);
     if (localPlayer) this.game.debug.text("Lives Remaining:  " + localPlayer.lives, 32, 64);
     if (localPlayer) this.game.debug.text("Enemies Remaining:  " + enemies.children.length, 32, 96);
     if (localPlayer) this.game.debug.text("Level:  " + currentWave, 32, 128);
  }


  /* =============== =============== ===============

   =============== CREATE FUNCTIONS ===============

   =============== =============== =============== */

  function configureGame(){
    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.physics.arcade.setBoundsToWorld()
    game.forceSingleUpdate = true //suggested sync config

    // game.world.setBounds(gameWidth * -1, gameHeight * -1, gameWidth, gameHeight)

    game.playerMap = {}
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    // configure FPS
    game.time.advancedTiming = true;
    game.time.desiredFps = 60;

    //bounds for enemy positioning
    game.startX = gameWidth
    game.startY = gameHeight
  }



  function addMap(type){
    if(type === 'desert') desertMap()
    if(type === 'forest') forestMap()
  }

  function desertMap(){
    map = game.add.tilemap('desert')
    map.addTilesetImage('Desert', 'tiles')
    layer = map.createLayer('Ground')
    layer.resizeWorld()
  }

  function forestMap(){
    map = game.add.tilemap('forest')
    map.addTilesetImage('forestTiles', 'forestTiles')
    map.addTilesetImage('tmw_desert_spacing', 'tiles')
    layer = map.createLayer('MapLayer')
    collisionLayer = map.createLayer('CollisionLayer')
    collisionLayer.visible = false
    map.setCollisionByExclusion([], true, collisionLayer)
  }

  //https://leanpub.com/html5shootemupinanafternoon/read <- info on randomizing enemy spawn
  function addEnemies(number = 100){
    enemies = game.add.group()
  }


  //https://www.joshmorony.com/how-to-create-an-animated-character-using-sprites-in-phaser/
  //https://www.codeandweb.com/blog/2014/12/17/creating-spritesheets-for-phaser-with-texturepacker
  function addPlayerAnimation(){

  }

  function createScoreAnimation(x,y,message,score){
    const scoreFont = "20px Orbitron"

    //Create a new label for the score
    const scoreAnimation = game.add.text(x, y, message, {font: scoreFont, fill: "#ff0000", stroke: "#ffffff", strokeThickness: 5})
    scoreAnimation.anchor.setTo(0.5, 0)
    scoreAnimation.align = 'center'

    //Tween this score label to the total score label
    // const scoreTween = game.add.tween(scoreAnimation).to({x:game.camera.width -230, y: 0}, 800, Phaser.Easing.Exponential.In, true)
    const scoreTween = game.add.tween(scoreAnimation).to({x:game.world.centerX, y: 0}, 800, Phaser.Easing.Exponential.In, true)

    //When the animation finishes, destroy this score label, trigger the total score labels animation and add the score
    scoreTween.onComplete.add(function(){
        scoreAnimation.destroy()
        game.scoreLabelTween.start()
        game.scoreBuffer += score
    }, game)
  }


  function addScore(){
    game.score = 0
    game.scoreBuffer = 0

    const scoreFont = "75px Orbitron"//"100px Indie Flower"

    // game.camera.width / 2 - 50, 50 //game.camera.width - 225, 0
    game.scoreLabel = game.add.text(game.camera.width / 2 - 50, 0, '0', {font: scoreFont, fill: "#ff0000", stroke: "#535353", strokeThickness: 10})
    // scoreLabel.anchor.setTo(0.5, 0)
    game.scoreLabel.align = 'center'
    game.scoreLabel.fixedToCamera = true;

    //Create a tween to grow / shrink the score label
    game.scoreLabelTween = game.add.tween(game.scoreLabel.scale).to({ x: 1.5, y: 1.5}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In)


  }



  function addPlayerGroup(){
    players = game.add.group()
    return players
  }

  function addWeapons(){
    weapons = game.add.group()
    weapons.add(new SingleBullet(game,'bullet'))
    weapons.add(new LazerBeam(game,'lazer'))
    weapons.add(new HeartGun(game,'heart'))
    game.weapons = weapons

    return weapons
  }

  function addInputs(){
    cursors = game.input.keyboard.createCursorKeys()
    fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)
    changeKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
    controls = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    }

  }





  /* =============== =============== ===============

   =============== UPDATE FUNCTIONS ===============

   =============== =============== =============== */

  function checkPlayerInputs(player){

    player.rotation = game.physics.arcade.angleToPointer(player)

    if (cursors.left.isDown || controls.left.isDown){
      player.body.x -= player.body.velocity.x
      return sendPlayerMovement(player)
    }
    if (cursors.right.isDown || controls.right.isDown){
      player.body.x += player.body.velocity.x
      return sendPlayerMovement(player)
    }
    if (cursors.up.isDown || controls.up.isDown){
      player.body.y -= player.body.velocity.y
      return sendPlayerMovement(player)
    }
    if (cursors.down.isDown || controls.down.isDown){
      player.body.y += player.body.velocity.y
      return sendPlayerMovement(player)
    }
    if (fireButton.isDown || game.input.activePointer.isDown){
      return sendShot(player)
    }
    if(changeKey.isDown){
      return changeWeapon(player)
    }
    // halt player if no input
    else{
      // return player.body.velocity.setTo(0,0)
      // player.body.angularVelocity = 0
      // player.body.velocity.x = 0
      // player.body.velocity.y = 0
    }
  }

  //check player state and then reanimate
  function animatePlayer(player){
    if(player.body.rotation === 1){
      //change animation [1,2]
    }
  }


  function sendPlayerMovement(player){
     return socket.emit('movePlayer',{id: player.id, x: player.body.x, y: player.body.y, rotation: player.body.rotation, gameID: player.gameID}) //gameID: player.gameID
  }

  function sendShot(player){
     const weapon = player.weapons.children[player.currentWeapon]

     const type = weapon.cursor.type //recent addition to be able to view other peoples firing type

     if(checkTimeToFire(player,weapon)){
       return socket.emit('shoot', {id: player.id, x: player.body.x, y: player.body.y, v: weapon.bulletSpeed, r: player.body.rotation, type: type, gameID: player.gameID})
     }
  }

  function checkTimeToFire(player, weapon){
     if (game.time.time < weapon.nextFire) {
       return false
     }
     else{
       weapon.nextFire = game.time.time + weapon.fireRate
       return true
     }
  }


  function changeWeapon(player){
    if(player.currentWeapon === 2){
      player.currentWeapon = 0
      return player
    }

    if(player.currentWeapon === 1){
      player.currentWeapon = 2
      return player
    }

    if(player.currentWeapon === 0){
      player.currentWeapon = 1
      return player
    }
  }




  function checkCollisions(){
    game.physics.arcade.collide(localPlayer, collisionLayer)
    game.physics.arcade.collide(enemies, collisionLayer)

    /* Collide weaponry with enemies */
    game.physics.arcade.overlap(localPlayer.weapons, enemies, hitEnemy, null, this)

    /* Collide enemy with players */
    game.physics.arcade.overlap(enemies, localPlayer, hitPlayer, null, this)

    /* Collide player with world bounds */
  }


  function hitEnemy(bullet, enemy){
    const damage = bullet.parent.damage
    enemy.takeDamage(damage)
    bullet.kill()
    socket.emit('enemyHit',{id: enemy.id, damage: damage, gameID: enemy.gameID})
    enemiesAdded = true
    const score = damage
    // game.score += 5
    createScoreAnimation(enemy.x,enemy.y,`${score}`,5)
  }


  function hitPlayer(player, enemy){
    if (game.time.time < enemy.nextAttack) return
    else {
      enemy.nextAttack = game.time.time + enemy.attackSpeed;
      player.takeDamage(enemy.damage)
      enemyAtackAnimation(enemy)
      socket.emit('playerAttacked', {id: player.id, health: player.health, lives: player.lives, gameID: player.gameID})
    }
  }


  function enemyAtackAnimation(enemy){
    const zombieAttack = game.add.sprite(enemy.body.x, enemy.body.y, 'zombieAttack')
    const attack = zombieAttack.animations.add('attack')
    zombieAttack.animations.play('attack', 10, false, true)
  }

  //handle player respawn and messages to backend
  function checkPlayerStatus(player){
    if(player.lives === 0){
      player.kill()
    }
  }

  function checkScore(){
    if(game.scoreBuffer > 0){
        incrementScore()
        game.scoreBuffer--
    }
  }

  function incrementScore(){
    game.score += 1
    game.scoreLabel.text = game.score
    window._score = game.score
  }


  function checkEnemyActions(){
    if(enemies) {
      for(let enemy = 0; enemy < enemies.children.length; enemy++){
        enemyOperations(enemies.children[enemy])
      }
    }
  }

  function enemyOperations(enemy){
    if(enemy.isAlive()){
      if(checkTimeSinceLastMove(enemy)){
        enemy.move(game, enemy, findClosestPlayer(enemy)) //use custom movetoobject to calc next pos
        enemyHandlers.sendEnemyMovement(enemy)
        return enemy
      }
      return enemy
    }
    // return enemy.kill()
    return enemy.destroy()
  }

  function findClosestPlayer(enemy){
    if(enemy.body) {
      for(let player = 0; player < players.children.length; player++){
        if(Math.abs(enemy.body.x) - Math.abs(players.children[player].body.x) < 500){
          return players.children[player]
        }
      }
    }
  }

  function checkTimeSinceLastMove(enemy){
    if(game.time.time < enemy.nextMove) return false
    else {
      //add a 500 milisecond delay between movements
      enemy.nextMove = game.time.time + 500;
      return true
    }
  }

function checkGameOver(){
  if(localPlayer.lives < 0 || localPlayer.lives === 0 && enemiesAdded){
    // refresh socket after game over: socket.emit('disconnect')
    socket.emit('gameOver', {gameID: globalGameID[0]})
    CivZombie.game.state.start('GameOver')
  }
}

function checkWaveComplete(){
  if(enemies.children.length === 0 && globalGameID[0] && enemiesAdded) {
    announceLevel()
    currentWave++
    setTimeout(() => socket.emit('waveComplete', {gameID: globalGameID[0], curWave: currentWave}), 3000)

    console.log('WAVE COMPLETE!!!!!!')
    enemiesAdded = false
    window._level = currentWave
  }
}

function announceLevel(){
  const txt = game.add.text(game.camera.width / 2, game.camera.height / 2, `WAVE ${currentWave} Complete`, {font: "60px Orbitron", fill: "#ffffff", stroke: '#000000', strokeThickness: 7});
  txt.anchor.setTo(0.5, 0.5);
  txt.fixedToCamera = true;
  setTimeout(() => txt.destroy(),3000)
}


  /* =============== =============== ===============

   =============== MULTIPLAYER FUNCTIONS ===============

   =============== =============== =============== */
  function shootOperation(data){
    const player = game.playerMap[data.pid];
    const weapon = player.weapons.children[player.currentWeapon]
    const bullet = weapon.children[data.id]
    bullet.reset(data.x,data.y)
    bullet.rotation = data.r

    // bullet.body.velocity = game.physics.arcade.velocityFromRotation(bullet.rotation, bullet.body.velocity)
    game.physics.arcade.velocityFromAngle(bullet.rotation, weapon.bulletSpeed, bullet.body.velocity)
  }

  //similar to shoot operation, but removes velocity factor
  function layMine(data){
    const player = game.playerMap[data.pid];
    const weapon = player.weapons.children[player.currentWeapon]
    const bullet = weapon.children[data.id]
    bullet.reset(data.x,data.y)
    bullet.rotation = data.r
  }

  function addPlayersToGame(player){
    players.add(player)
    game.playerMap[player.id] = player


    if(!localPlayer) {
      localPlayer = player
      globalGameID.push(localPlayer.gameID)

      // game.gameID = localPlayer.gameID
      game.camera.follow(localPlayer)
    }
  }

  function removeOperations(removePlayer){
    console.log('removing player!', removePlayer)
    removePlayer.kill()
    delete game.playerMap[removePlayer.id]
  }

  function addEnemiesToGroup(data){
    currentWave = data.level
    return enemies.add(data.enemy)
  }


  function errorHandler(error){
    console.error('Event Emitter Error: ',error)
  }







export default game
