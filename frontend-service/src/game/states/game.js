/* ----- Model Dependencies ----- */
import Bullet from '../models/bullet'
import {SingleBullet, LazerBeam} from '../models/weapon'
import Enemy from '../models/enemy'
import Player from '../models/player'


/* ----- State Dependencies ----- */
import CivZombie from '../main'

/* ----- Server Dependencies ----- */
import {socket, setEventHandlers, playerObs} from '../eventHandlers'
import enemyHandlers from '../eventHandlers/enemyHandlers'
import playerHandlers from '../eventHandlers/playerHandlers'



  /* ----- Declares global variables ----- */
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
  const score = 0
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

    game.load.image('frontRobot', './assets/frontRobot.png') //Zombie_Sprite CZombie
    game.load.image('backRobot', './assets/backRobot.png') //Zombie_Sprite CZombie

    game.load.image('zombie', './assets/CZombieMini.png') //Zombie_Sprite CZombie
    game.load.image('Zombie_Sprite', './assets/Zombie_Sprite.png') //Zombie_Sprite CZombie
    game.load.image('bullet', './assets/singleBullet.png')
    game.load.image('lazer', './assets/lazer.png')
    game.load.spritesheet('zombies', './assets/zombie_sheet.png', 32, 48)
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

    // checkForNewPlayers()
    addEnemiesToGroup()
    enemyHandlers.addRemoteEnemies()
  }

  function update(){
    if (localPlayer) checkPlayerInputs(localPlayer)
    if (localPlayer) checkCollisions()
    if (localPlayer && enemies) checkEnemyActions()

    if (localPlayer && enemies) checkWaveComplete()

    checkScore()
    checkGameOver()
  }

  function render(){
	  //  if (localPlayer) game.debug.text("Player Health: " + localPlayer.health + " / " + localPlayer.maxHealth, 32, 32);
	  //  if (localPlayer) game.debug.text("Player Score:  " + game.score, 32, 64);
    //  if (localPlayer) game.debug.text("Enemies Remaining:  " + enemies.children.length, 32, 96);
  }


  /* =============== =============== ===============

   =============== CREATE FUNCTIONS ===============

   =============== =============== =============== */

  function configureGame(){
    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.forceSingleUpdate = true //suggested sync config

    game.world.setBounds(-1000, -1000, 2000, 2000)
    console.log(game.world)


    game.playerMap = {}
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    // configure FPS
    game.time.advancedTiming = true;
    game.time.desiredFps = 60;

    //bounds for enemy positioning
    game.startX = 32
    game.startY = game.world.height / 2
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
    const scoreFont = "20px Arial"

    //Create a new label for the score
    const scoreAnimation = game.add.text(x, y, message, {font: scoreFont, fill: "#ff0000", stroke: "#ffffff", strokeThickness: 5})
    scoreAnimation.anchor.setTo(0.5, 0)
    scoreAnimation.align = 'center'

    //Tween this score label to the total score label
    const scoreTween = game.add.tween(scoreAnimation).to({x:game.world.centerX, y: 50}, 800, Phaser.Easing.Exponential.In, true)

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
    // game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#111' })

    const scoreFont = "100px Indie Flower"

    //Create the score label -> may want to move away from adding it directly on game object?
    game.scoreLabel = game.add.text(game.world.centerX, 50, '0', {font: scoreFont, fill: "#ff0000", stroke: "#535353", strokeThickness: 15})
    // scoreLabel.anchor.setTo(0.5, 0)
    game.scoreLabel.align = 'center'

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


   //http://phaser.io/examples/v2/input/cursor-key-movement
   //http://examples.phaser.io/_site/view_full.html?d=arcade%20physics&f=angular+velocity.js&t=angular%20velocity)
   //https://phaser.io/examples/v2/arcade-physics/shoot-the-pointer
   //https://github.com/tlmader/theodoric/blob/master/js/Game.js
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
    if(player.currentWeapon === 1){
      player.currentWeapon = 0
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

    /* Collide weaponry with other players */
      //currently a stretch goal to include 3v3 mode
      // game.physics.arcade.overlap(localPlayer.weapons, players, hitPlayer, null, this)
  }

  function hitEnemy(bullet, enemy){
    const damage = bullet.parent.damage
    enemy.takeDamage(damage)
    bullet.kill()
    console.log("Hit Zombie")
    socket.emit('enemyHit',{id: enemy.id, damage: damage, gameID: enemy.gameID})
    enemiesAdded = true
    const score = damage
    // game.score += 5
    createScoreAnimation(enemy.x,enemy.y,`${score}`,5)
  }

  function hitPlayer(bullet, player){
    console.log(bullet, player)
    player.takeDamage(bullet.parent.damage)
    // bullet.kill() //<- hits own player
    console.log("Hit Player")


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
  }


  function checkEnemyActions(){
    if(enemies) {
      for(let enemy = 0; enemy < enemies.children.length; enemy++){
        enemyOperations(enemies.children[enemy])
      }
    }
  }

  function findClosestPlayer(enemy){
    if(enemy.body) {
      for(let player = 0; player < players.children.length; player++){
        if(Math.abs(enemy.body.x) - Math.abs(players.children[player].body.x) < 100){
          return players.children[player]
        }
      }
    }
  }

  function enemyOperations(enemy){
    if(enemy.isAlive()){
      if(checkTimeSinceLastMove(enemy)){
        console.log('checked ')
        enemy.move(game, enemy, findClosestPlayer(enemy)) //use custom movetoobject to calc next pos
        enemyHandlers.sendEnemyMovement(enemy)
        return enemy
      }
      return enemy
    }
    // return enemy.kill()
    return enemy.destroy()
  }

  function checkTimeSinceLastMove(enemy){
    if(game.time.time < enemy.nextMove) return false
    else {
      //add a 1000 milisecond delay between movements
      enemy.nextMove = game.time.time + 500;
      return true
    }
  }

function checkGameOver(){
  if(game.score >= 9000){
    // refresh socket after game over: socket.emit('disconnect')
    socket.emit('gameOver', {gameID: globalGameID[0]})
    CivZombie.game.state.start('GameOver')

  }
}

function checkWaveComplete(){
  console.log(enemies.children.length === 0)
  if(enemies.children.length === 0 && globalGameID[0] && enemiesAdded) {
    currentWave++
    socket.emit('waveComplete', {gameID: globalGameID[0], curWave: currentWave})
    console.log('WAVE COMPLETE!!!!!!')
    enemiesAdded = false
  }
}




  /* =============== =============== ===============

   =============== MULTIPLAYER FUNCTIONS ===============

   =============== =============== =============== */

   //add rotation back in!

  function shootOperation(data){
    const player = game.playerMap[data.pid];
    const weapon = player.weapons.children[player.currentWeapon]
    const bullet = weapon.children[data.id]
    console.log('bullets', bullet)
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
      console.log('setting local player', player.id)
      localPlayer = player
      globalGameID.push(localPlayer.gameID)

      // game.gameID = localPlayer.gameID
      game.camera.follow(localPlayer)
    }
  }


  function removeOperations(removePlayer){
    removePlayer.kill()
    delete game.playerMap[removePlayer.id]
  }



  /** Event Listeners outside of update loop*/
  playerObs.on('removePlayer', removeOperations)
  playerObs.on('movingPlayer', playerHandlers.movePlayerOperation)
  playerObs.on('shootPlayer', shootOperation)
  playerObs.on('movingEnemy', enemyHandlers.moveEnemyOperation)
  playerObs.on('addPlayer', addPlayersToGame)

  function addEnemiesToGroup(){
    playerObs.on('enemyGroup',(data) => {
      console.log('enemy data!!',data)
      return enemies.add(data)
    })
  }



export default game
