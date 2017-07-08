//https://www.joshmorony.com/create-a-running-platformer-game-in-phaser-with-tilemaps/
  //use tiled to generate tile maps for the gameplay
   //https://opengameart.org/content/trees-bushes
    //^source of free png for generating tilemaps

//Use for strategic view and or capital tactical traversal
  //https://opengameart.org/content/colony-sim-assets


/* ----- Phaser Dependencies ----- */
import Bullet from './bullet'
import {SingleBullet, LazerBeam} from './weapon'
import Enemy from './enemy'

/* ----- Server Dependencies ----- */
import client from '../client'
import eventHandlers from './eventHandlers'



const game = (function startGame(){

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

  let players //Not properly hooked up yet

  const gameWidth = 1000
  const gameHeight = 800

  const allPlayers = []

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

    game.playerMap = {}

    addMap('desert') // specify map can be: ['desert', 'forest']
    addEnemies()
    addPlayer()
    addInputs()

    // Instantiate player server
      //need to identify how to incorporate information flow
    client.askNewPlayer()

    // Start listening for events
    eventHandlers.setEventHandlers()
  }


  function update(){
    checkEnemyActions()
    checkPlayerInputs()
    checkCollisions()
  }


  function render(){
    //game.debug.spriteInfo(player, 32, 450);
  }





  /* =============== =============== =============== */

  /* =============== UPDATE FUNCTIONS =============== */

  /* =============== =============== =============== */


  function checkPlayerInputs(){
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

  function checkCollisions(){
    game.physics.arcade.collide(player, collisionLayer)
    game.physics.arcade.collide(enemies, collisionLayer)

    /* Collide weaponry with enemies */
    game.physics.arcade.overlap(player.weapons, enemies, hitEnemy, null, this)

    /* Collide weaponry with other players */
    game.physics.arcade.overlap(player.weapons, players, hitPlayer, null, this)
  }

  function hitEnemy(bullet, enemy){
    enemy.takeDamage(bullet.parent.damage)
    bullet.kill()
    console.log("Hit Zombie")
  }

  function hitPlayer(bullet, player){
    player.takeDamage(bullet.parent.damage)
    bullet.kill()
    console.log("Hit Player")
  }

  function checkEnemyActions(){
    enemies.children.forEach(enemy => {
        enemy.isAlive()
        enemy.move()
    })
  }



  /* =============== =============== =============== */

  /* =============== CREATE FUNCTIONS =============== */

  /* =============== =============== =============== */


  function addInputs(){
    cursors = game.input.keyboard.createCursorKeys()
    fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)
    changeKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
  }


  function addMap(type){
    if(type === 'desert') desertMap()
    if(type === 'forest') forestMap()
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

  function desertMap(){
    map = game.add.tilemap('desert')
    map.addTilesetImage('Desert', 'tiles')
    layer = map.createLayer('Ground')
    layer.resizeWorld()
  }


  function addEnemies(number){
    enemies = game.add.group()

    function addZombie(number = 5){
      let i = 0
      while(i++ < number){
        enemies.add(new Enemy(game,gameWidth,gameHeight,'zombie'))
      }
    }

    addZombie(number)

    /* ----- Generate Zombies FRP ----- */
    // function handleError(err){
    //   return console.error(err)
    // }
    //
    // const source = Rx.Observable.interval(1000 /* ms */).timeInterval().take(5)
    // const subscription = source.subscribe(addZombie,handleError)
  }

  function addPlayer(){
    player = game.add.sprite(32, game.world.height / 2, 'zombie')

    weapons = game.add.group()
    weapons.add(new SingleBullet(game,'bullet'))
    weapons.add(new LazerBeam(game,'lazer'))
    player.weapons = weapons
    player.currentWeapon = 0

    game.physics.arcade.enable(player)

    player.body.velocity.x = 10
    player.body.velocity.y = 10

    game.camera.follow(player)
  }

  return game // may not be best practices ... but attempting to contain scope

})()

export default game
