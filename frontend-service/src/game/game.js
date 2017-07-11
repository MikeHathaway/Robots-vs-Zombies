// minimap guide
  //http://www.html5gamedevs.com/topic/14182-creating-a-mini-map-in-phaser/

//game timer - womprat stomping

/* ----- Phaser Dependencies ----- */
import Bullet from './models/bullet'
import {SingleBullet, LazerBeam} from './models/weapon'
import Enemy from './models/enemy'
import Player from './player'


/* ----- Server Dependencies ----- */
import {socket, setEventHandlers, playerObs} from './eventHandlers'

//import observable that defines player variables
  //could also set player equal to game.localPlayer?

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

  playerObs.on('test', (data) => console.log(data))


  /* ----- Start Game Instance ----- */
  const game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game-container', {
      preload: preload,
      create: create,
      update: update,
      render: render
  })


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
    // game.world.setBounds(-1000, -1000, 2000, 2000);

    addMap('desert') // specify map can be: ['desert', 'forest']
    addEnemies(5) //specify number of enemies to be added

    addWeapons()
    addPlayer() // <- currently incomplete, need to finish tie up
    setEventHandlers() // Start listening for events

    addInputs() // Add game controls
    addScore() // Score animations

    checkForNewPlayers()
  }

  function update(){
    if (localPlayer) checkEnemyActions()
    if (localPlayer) checkPlayerInputs(localPlayer)
    if (localPlayer) checkCollisions()
    checkScore()
    checkRemovePlayer()
  }

  function render(){
    //game.debug.spriteInfo(player, 32, 450)
  }





  /* =============== =============== ===============

   =============== CREATE FUNCTIONS ===============

   =============== =============== =============== */

  function addInputs(){
    cursors = game.input.keyboard.createCursorKeys()
    fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)
    changeKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
  }

  function addInputsTwo(){
    return {
      cursors: game.input.keyboard.createCursorKeys(),
      fireButton: game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR),
      changeKey: game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
    }
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


  function addEnemies(number){
    enemies = game.add.group()

    function addZombie(number = 100){
      let i = 0
      while(i++ < number){
        enemies.add(new Enemy(game,gameWidth,gameHeight,'zombie'))
      }
    }

    addZombie(number)

    /* ----- Generate Zombies FRP ----- */
    // const source = Rx.Observable.interval(1000 /* ms */).timeInterval().take(5)
    // const subscription = source.subscribe(addZombie,handleError)
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






  /* =============== =============== ===============

   =============== MULTIPLAYER FUNCTIONS ===============

   =============== =============== =============== */

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
    }
    if (cursors.right.isDown){
      player.body.x += player.body.velocity.x
    }

    if (cursors.up.isDown){
      player.body.y -= player.body.velocity.y
    }

    if (cursors.down.isDown){
      player.body.y += player.body.velocity.y
    }

    if (fireButton.isDown){
      player.weapons.children[player.currentWeapon].fire(player)
    }

    if(changeKey.isDown){
      changeWeapon(player)
    }
    socket.emit('movePlayer',{id: player.id, x: player.body.x, y: player.body.y})
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
    game.physics.arcade.overlap(localPlayer.weapons, players, hitPlayer, null, this)
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
    player.takeDamage(bullet.parent.damage)
    // bullet.kill() //<- hits own player
    console.log("Hit Player")
  }

  function checkEnemyActions(){
    enemies.children.forEach(enemy => {
        enemy.isAlive()
        if(localPlayer) enemy.move(game,enemy,localPlayer)
    })
  }

  function aimRotation(){
    const myPoint = new Phaser.Point( sprite.width / 2 + 30,  -sprite.height / 2)
    myPoint.rotate(sprite.rotation)
    this.getFirstExists(false).fire(sprite.x+myPoint.x, sprite.y+myPoint.y, sprite.rotation, BulletPool.BULLET_SPEED)
  }

  function checkForNewPlayers(){
    playerObs.on('addPlayer', addPlayersToGame)
  }

  function addPlayersToGame(player){
    console.log('Event received')
    players.add(player)
    localPlayer = player
    game.camera.follow(localPlayer)
  }

  function checkRemovePlayer(){
    playerObs.on('removePlayer', (removePlayer) => {
      removePlayer.kill()
    })


export default game
