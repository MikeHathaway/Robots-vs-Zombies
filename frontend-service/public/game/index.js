
/*
current topdown tutorial
  https://www.programmingmind.com/phaser/topdown-layers-moving-and-collision
*/

//https://www.joshmorony.com/create-a-running-platformer-game-in-phaser-with-tilemaps/
  //use tiled to generate tile maps for the gameplay
   //https://opengameart.org/content/trees-bushes
   //^source of free png for generating tilemaps

//Use for strategic view and or capital tactical traversal
  //https://opengameart.org/content/colony-sim-assets

//weapon enemy collisions
//http://www.html5gamedevs.com/topic/27245-require-help-with-collision-between-weapon-and-enemy-group/

// import { Weapon } from "game/weapon"

(function startGame(){

  const gameWidth = 1000
  const gameHeight = 800

  const game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game-container', {
      preload: preload,
      create: create,
      update: update,
      render: render
  })

  function preload(){
    //game.load.crossOrigin = 'anonymous'

    // game.load.tilemap('desert', './game/assets/tilemaps/desert.json', null, Phaser.Tilemap.TILED_JSON)

    game.load.tilemap('forest', './game/assets/tilemaps/forest.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.image('forestTiles', './game/assets/tilemaps/trees-and-bushes.png')
    game.load.image('tiles', './game/assets/tilemaps/tmw_desert_spacing.png')

    game.load.image('zombie', './game/assets/Zombie_Sprite.png')
    game.load.image('human', './game/assets/dude.png')
    game.load.image('bullet', './game/assets/singleBullet.png');
    game.load.image('lazer', './game/assets/lazer.png');
    game.load.spritesheet('zombies', './game/assets/zombie_sheet.png', 32, 48)
  }


  /* ----- Declares global variables ----- */
  let map
  let layer
  let player
  let cursors
  let firebutton
  let changeKey
  let collisionLayer
  let enemies

  const weapons = []
  const players = []


  /* ----- Helper Functions ----- */
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
    // map = game.add.tilemap('desert')
    // layer = map.createLayer('Ground')
    // layer.resizeWorld()

    /* new forest test map */
    map = game.add.tilemap('forest')
    map.addTilesetImage('forestTiles', 'forestTiles')
    map.addTilesetImage('tmw_desert_spacing', 'tiles')

    layer = map.createLayer('MapLayer')

    collisionLayer = map.createLayer('CollisionLayer');
    collisionLayer.visible = false;
    map.setCollisionByExclusion([], true, collisionLayer);

    layer.resizeWorld()
  }



  function addEnemies(){
    enemies = game.add.group()

    /* ----- Generate Zombies FRP ----- */
    function addZombie(number = 5){
      let i = 0
      while(i++ < number){
        enemies.add(new Enemy(game,gameWidth,gameHeight,'zombie')).spawnEnemy(game,gameWidth,gameHeight)
      }
    }

    addZombie()

    // function handleError(err){
    //   return console.error(err)
    // }
    //
    // const source = Rx.Observable.interval(1000 /* ms */).timeInterval().take(5);
    // const subscription = source.subscribe(addZombie,handleError)
  }


  function addPlayer(){
    player = game.add.sprite(32, game.world.height / 2, 'zombie')
    player.weapons = weapons
    player.currentWeapon = 0

    // Add Weapons to player
    weapons.push(new Weapon.SingleBullet(game));
    weapons.push(new Weapon.Beam(game));

    //  We need to enable physics on the player
    game.physics.arcade.enable(player)

    game.camera.follow(player)
  }




  function create(){

    game.physics.startSystem(Phaser.Physics.ARCADE)

    addMap()
    addEnemies()

    addPlayer()

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    changeKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  }


  function update(){

    game.physics.arcade.collide(player, collisionLayer);

    /* Collide weaponry with enemies */
    game.physics.arcade.overlap(player.weapons[player.currentWeapon].children, enemies, Enemy.hitEnemy, null, this);

    // console.log(enemies)

    player.body.velocity.x = 10;
    player.body.velocity.y = 10;
    // player.body.angularVelocity = 0;

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
      player.weapons[player.currentWeapon].fire(player);
    }

    if(changeKey.isDown){
      changeWeapon(player)
    }


  }

  function render(){

  }

})()
