// minimap guide
  //http://www.html5gamedevs.com/topic/14182-creating-a-mini-map-in-phaser/

//http://www.html5gamedevs.com/topic/18553-performance-issues-are-making-project-unplayable/

//https://developer.tizen.org/community/tip-tech/creating-isometric-world-phaser.js-using-isometric-plugin
//https://gamedevelopment.tutsplus.com/tutorials/creating-isometric-worlds-primer-for-game-developers-updated--cms-28392
  // ^includes a really cool minimap

/* ----- Phaser Dependencies ----- */
import Bullet from './models/bullet'
import {SingleBullet, LazerBeam} from './models/weapon'
import Enemy from './models/enemy'
import Player from './models/player'

/* ----- Server Dependencies ----- */
import {socket, setEventHandlers, playerObs} from './eventHandlers'


  /* ----- Declares global variables ----- */
  let map
    , layer
    , players
    , cursors
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
  const numEnemies = 5


  /* ----- Start Game Instance ----- */
    //formerly Phaser.AUTO for rendering; forcing Phaser.CANVAS to boost performacne
  const game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, 'game-container', {
      init: init,
      preload: preload,
      create: create,
      update: update,
      render: render
  })


  function init(){
    game.stage.disableVisibilityChange = true
  }

  function preload(){
    game.load.crossOrigin = 'anonymous'

    game.load.tilemap('desert', './assets/tilemaps/desert.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.tilemap('forest', './assets/tilemaps/forest.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.image('forestTiles', './assets/tilemaps/trees-and-bushes.png')
    game.load.image('tiles', './assets/tilemaps/tmw_desert_spacing.png')

    game.load.image('zombie', './assets/Zombie_Sprite.png')
    game.load.image('human', './assets/dude.png')
    game.load.image('bullet', './assets/singleBullet.png')
    game.load.image('lazer', './assets/lazer.png')
    game.load.spritesheet('zombies', './assets/zombie_sheet.png', 32, 48)
  }

  function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE)
    // game.world.setBounds(-1000, -1000, 2000, 2000)
    game.playerMap = {}

    addMap('desert') // specify map can be: ['desert', 'forest']
    addEnemies(numEnemies) //specify number of enemies to be added
    addWeapons()
    addPlayer() // <- currently incomplete, need to finish tie up
    addInstructions()

    setEventHandlers() // Start listening for events

    addInputs() // Add game controls
    addScore() // Score animations

    checkForNewPlayers()

    addRemoteEnemies() // render enemies received from server
  }

  function update(){

    if (localPlayer) checkEnemyActions()
    if (localPlayer) checkPlayerInputs(localPlayer)
    if (localPlayer) checkCollisions()

    /* Multiplayer Functions */
    if (localPlayer) moveRemotePlayer()
    if (localPlayer) shootPlayer()

    checkScore()
    checkRemovePlayer()
    removeInstructions()
  }

  function render(){
	   if (localPlayer) game.debug.text("Player Health: " + localPlayer.health + " / " + localPlayer.maxHealth, 32, 32);
	   if (localPlayer) game.debug.text("Player Score:  " + game.score, 32, 64);
     if (localPlayer) game.debug.text("Enemies Remaining:  " + enemyMap.length, 32, 96);
  }





  /* =============== =============== ===============

   =============== CREATE FUNCTIONS ===============

   =============== =============== =============== */

  function addInputs(){
    cursors = game.input.keyboard.createCursorKeys()
    fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)
    changeKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
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
    socket.emit('newEnemies',{number: number, x: gameWidth, y: gameHeight})
  }

  // function triggerEnemySpawn(){
  //   const source = Rx.Observable.interval(1000 /* ms */).timeInterval().take(5)
  //   const subscription = source.subscribe(addZombie,handleError)
  // }


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

  function addInstructions(){
    const message = 'Use Arrow Keys to Move, Press Space to Fire, \n Press Enter to change weapon'
    const messageStyle = { font: '20px monospace', fill: '#fff', align: 'center' }
    game.instructions = game.add.text(400, 500, message, messageStyle)
    game.instructions.anchor.setTo(0.5, 0.5)
    game.instExpire = game.time.now + 10000
  }


  function addPlayer(){
    players = game.add.group()

    // game.localPlayer = new Player(game,100,game.world.height / 2,'zombie',50,5,game.weapons,socketId)
    // players.add(game.localPlayer)

    game.startX = 32
    game.startY = game.world.height / 2

    console.log(players)
    // game.camera.follow(game.localPlayer)
  }

  function addWeapons(){
    weapons = game.add.group()
    weapons.add(new SingleBullet(game,'bullet'))
    weapons.add(new LazerBeam(game,'lazer'))

    game.weapons = weapons
  }








  /* =============== =============== ===============

   =============== UPDATE FUNCTIONS ===============

   =============== =============== =============== */


  function checkPlayerInputs(player){
    if (cursors.left.isDown){
      player.body.x -= player.body.velocity.x
      sendPlayerMovement(player)
    }
    if (cursors.right.isDown){
      player.body.x += player.body.velocity.x
      sendPlayerMovement(player)
    }

    if (cursors.up.isDown){
      player.body.y -= player.body.velocity.y
      sendPlayerMovement(player)
    }

    if (cursors.down.isDown){
      player.body.y += player.body.velocity.y
      sendPlayerMovement(player)
    }

    if (fireButton.isDown){
      // player.weapons.children[player.currentWeapon].fire(player)
      sendShot(player)
    }

    if(changeKey.isDown){
      changeWeapon(player)
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
    enemy.takeDamage(bullet.parent.damage)
    bullet.kill()
    console.log("Hit Zombie")

    const score = bullet.parent.damage
    // game.score += 5
    createScoreAnimation(enemy.x,enemy.y,`${score}`,5)
  }

  function hitPlayer(bullet, player){
    console.log(bullet, player)
    player.takeDamage(bullet.parent.damage)
    // bullet.kill() //<- hits own player
    console.log("Hit Player")
  }

  function checkEnemyActions(){
    if(enemies) enemies.children.forEach(enemyOperations)
  }

  function enemyOperations(enemy){
    enemy.isAlive()
    enemy.move(game,enemy,localPlayer)
    sendEnemyMovement(enemy)
  }

  function aimRotation(){
    const myPoint = new Phaser.Point( sprite.width / 2 + 30,  -sprite.height / 2)
    myPoint.rotate(sprite.rotation)
    this.getFirstExists(false).fire(sprite.x+myPoint.x, sprite.y+myPoint.y, sprite.rotation, BulletPool.BULLET_SPEED)
  }


  function removeInstructions(){
    if(game.instructions.exists && game.time.now > game.instExpire){
      game.instructions.destroy()
    }
  }





    /* =============== =============== ===============

     =============== MULTIPLAYER FUNCTIONS ===============

     =============== =============== =============== */


  function sendShot(player){
     const weapon = player.weapons.children[player.currentWeapon]

     if(checkTimeToFire(player,weapon)){
       socket.emit('shoot', {id: player.id, x: player.body.x, y: player.body.y, v: weapon.bulletSpeed, r: player.body.rotation})
     }
  }

  function checkTimeToFire(player, weapon){
     if (game.time.time < weapon.nextFire) {
       return false
     }
     else{
       weapon.nextFire = game.time.time + weapon.fireRate;
       return true
     }
  }

  function shootPlayer(){
    playerObs.on('shootPlayer', shootOperation)
  }

  function shootOperation(data){
    const player = game.playerMap[data.pid];
    const weapon = player.weapons.children[player.currentWeapon]
    const bullet = weapon.children[data.id]
    bullet.reset(data.x,data.y)
    bullet.rotation = data.r
    // weapon.fire(player)
    // bullet.body.velocity = game.physics.arcade.velocityFromRotation(bullet.rotation, bullet.body.velocity)
    game.physics.arcade.velocityFromAngle(bullet.rotation, bullet.bulletSpeed, bullet.body.velocity)
  }

  //similar to shoot operation, but removes velocity factor
  function layMine(){
    const player = game.playerMap[data.pid];
    const weapon = player.weapons.children[player.currentWeapon]
    const bullet = weapon.children[data.id]
    bullet.reset(data.x,data.y)
    bullet.rotation = data.r
  }


  function checkForNewPlayers(){
    playerObs.on('addPlayer', addPlayersToGame)
  }

  function addPlayersToGame(player){
    console.log('Playerd added')
    players.add(player)
    game.playerMap[player.id] = player
    if(!localPlayer) {
      localPlayer = player
      game.camera.follow(localPlayer)
    }
  }


  function sendPlayerMovement(player){
     socket.emit('movePlayer',{id: player.id, x: player.body.x, y: player.body.y})
  }

  function moveRemotePlayer(){
    playerObs.on('movingPlayer', movePlayerOperation)
  }

  function movePlayerOperation(movePlayer){
    const player = movePlayer.player
    const xCord = movePlayer.data.x
    const yCord = movePlayer.data.y

    const distance = Phaser.Math.distance(player.x,player.y,xCord,yCord)
    const tween = game.add.tween(player)
    // const duration = distance*10
    tween.to({x:xCord,y:yCord}, 5) //formerly duration
    tween.start()
  }


  function sendEnemyMovement(enemy){
    socket.emit('moveEnemy',{id: enemy.id, x: enemy.body.x, y: enemy.body.y})
  }

  function moveEnemy(){
    playerObs.on('movingEnemy', moveEnemyOperation)
  }

  function moveEnemyOperation(moveEnemy){
    console.log('moveEnemyOperation', moveEnemy)
  }


  function checkRemovePlayer(){
    playerObs.on('removePlayer', removeOperations)
  }

  function removeOperations(removePlayer){
    removePlayer.kill()
    delete game.playerMap[removePlayer.id]
  }


  function addRemoteEnemies(){
    playerObs.on('addEnemies', addEnemyOperation)
  }

  //Need to restrict message flow once expected number of enemies generated
  function addEnemyOperation(enemyData){
    // console.log('enemyData',enemyData)
    if(enemyMap.length < 5){
      enemyData.enemyList.forEach(enemy => {
        const newEnemy = new Enemy(game,enemy.x,enemy.y,enemy.type,enemy.id)
        enemies.add(newEnemy)
        return enemyMap.push(newEnemy)
      })
    }
    // console.log('additional enemy data',enemyData)

  }



export default game
