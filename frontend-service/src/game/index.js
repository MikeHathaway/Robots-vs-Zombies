//https://www.joshmorony.com/create-a-running-platformer-game-in-phaser-with-tilemaps/
  //use tiled to generate tile maps for the gameplay
   //https://opengameart.org/content/trees-bushes
    //^source of free png for generating tilemaps

//Use for strategic view and or capital tactical traversal
  //https://opengameart.org/content/colony-sim-assets

//http://www.dynetisgames.com/2017/03/06/how-to-make-a-multiplayer-online-game-with-phaser-socket-io-and-node-js/
    // ^making game multiplayer

/* ----- Phaser Dependencies ----- */
import Bullet from './bullet'
import {SingleBullet, LazerBeam} from './weapon'
import Enemy from './enemy'

/* ----- Server Dependencies ----- */
import client from '../feathers'


(function startGame(){

  /* ----- Declares global variables ----- */
  let map
  let layer
  let player
  let cursors
  let fireButton
  let changeKey
  let collisionLayer
  let enemies
  let bullets
  let weapons

  const gameWidth = 1000
  const gameHeight = 800
  const players = {}

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

    addMap()
    addEnemies()
    addPlayer()

    client.askNewPlayer()

    cursors = game.input.keyboard.createCursorKeys()
    fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)
    changeKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
  }


  function hitEnemy(bullet, enemy){
    enemy.takeDamage(bullet.parent.damage)
    bullet.kill()
    console.log("Hit")
  }


  function update(){

    game.physics.arcade.collide(player, collisionLayer)
    game.physics.arcade.collide(enemies, collisionLayer)

    /* Collide weaponry with enemies */
    game.physics.arcade.overlap(player.weapons, enemies, hitEnemy, null, this)

    // controller for enemy actions each game loop
    enemies.children.forEach(enemy => {
        enemy.isAlive()
        enemy.move()
    })


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


  }

  function render(){
    game.debug.spriteInfo(player, 32, 450);
  }



  /* ----- HELPER FUNCTIONS ----- */
  function changeWeapon(player){
    if(player.currentWeapon === 1){
      player.currentWeapon = 0
      return this
    }

    if(player.currentWeapon === 0){
      player.currentWeapon = 1
      return this
    }
  }

  function addMap(){

    /* old desert map */
    map = game.add.tilemap('desert')
    map.addTilesetImage('Desert', 'tiles')
    layer = map.createLayer('Ground')

    /* new forest test map */
    // map = game.add.tilemap('forest')
    // map.addTilesetImage('forestTiles', 'forestTiles')
    // map.addTilesetImage('tmw_desert_spacing', 'tiles')
    // layer = map.createLayer('MapLayer')
    // collisionLayer = map.createLayer('CollisionLayer')
    // collisionLayer.visible = false
    // map.setCollisionByExclusion([], true, collisionLayer)

    layer.resizeWorld()
  }



  function addEnemies(){
    enemies = game.add.group()

    /* ----- Generate Zombies FRP ----- */
    function addZombie(number = 5){
      let i = 0
      while(i++ < number){
        enemies.add(new Enemy(game,gameWidth,gameHeight,'zombie'))
      }
    }

    addZombie()

    // function handleError(err){
    //   return console.error(err)
    // }
    //
    // const source = Rx.Observable.interval(1000 /* ms */).timeInterval().take(5)
    // const subscription = source.subscribe(addZombie,handleError)
  }

  function addPlayer(){

    /* Approach to programmaticaly adding users */
    // Object.keys(players).forEach(player => {
    //
    // })

    player = game.add.sprite(32, game.world.height / 2, 'zombie')

    weapons = game.add.group()
    weapons.add(new SingleBullet(game,'bullet'))
    weapons.add(new LazerBeam(game,'lazer'))
    player.weapons = weapons
    player.currentWeapon = 0

    //  We need to enable physics on the player
    game.physics.arcade.enable(player)

    player.body.velocity.x = 10
    player.body.velocity.y = 10


    game.camera.follow(player)
  }

  //game.playerMap = {} -> alternative approach
  game.newPlayer = function(id,x,y){
    players[id] = game.add.sprite(x,y,'zombie')
  }

  game.removePlayer = function(id){
    players[id].destroy()
    delete players[id]
  }


})()
