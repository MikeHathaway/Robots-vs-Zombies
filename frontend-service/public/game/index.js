
/*
current topdown tutorial
  https://www.programmingmind.com/phaser/topdown-layers-moving-and-collision
*/

//https://www.joshmorony.com/create-a-running-platformer-game-in-phaser-with-tilemaps/
  //use tiled to generate tile maps for the gameplay
   //https://opengameart.org/content/trees-bushes
   //^source of free png for generating tilemaps

   //secret to react integration may lie in container component patter: https://medium.com/@learnreact/container-components-c0e67432e005
   //https://github.com/Xesenix/game-webpack-react-phaser-scaffold/tree/master/src/js/game/states

//Use for strategic view and or capital tactical traversal
  //https://opengameart.org/content/colony-sim-assets

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
    // game.load.image('tiles', './game/assets/tilemaps/tmw_desert_spacing.png')

    game.load.tilemap('forest', './game/assets/tilemaps/forest.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.image('forestTiles', './game/assets/tilemaps/trees-and-bushes.png')

    game.load.image('zombie', './game/assets/Zombie_Sprite.png')
    game.load.image('human', './game/assets/dude.png')
    game.load.image('bullet', './game/assets/singleBullet.png');
    game.load.image('lazer', './game/assets/lazer.png');
    game.load.spritesheet('zombies', './game/assets/zombie_sheet.png', 32, 48)
  }


  let map
  let layer
  let player
  let cursors
  let firebutton
  let changeKey
  let collisionLayer //not yet hooked up - need to properly reference in tilemap

  const weapons = []
  const players = []
  const enemies = []

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

  function addZombie(){
    return enemies.push(new Enemy(game,gameWidth,gameHeight))
  }


  function handleError(err){
    return console.error(err)
  }

  const source = Rx.Observable.interval(1000 /* ms */).timeInterval().take(5);
  const subscription = source.subscribe(addZombie,handleError)



  function create(){

    game.physics.startSystem(Phaser.Physics.ARCADE)

    /* old desert map */
    // map = game.add.tilemap('desert')
    // map.addTilesetImage('Desert', 'tiles')
    // layer = map.createLayer('Ground')
    // layer.resizeWorld()


    /* new forest test map */
    map = game.add.tilemap('forest')
    // map.addTilesetImage('Forest', 'forestTiles')

    layer = map.createLayer('MapLayer')

    collisionLayer = map.createLayer('CollisionLayer');
    collisionLayer.visible = false;

    map.setCollisionByExclusion([], true, collisionLayer);

    layer.resizeWorld()




    player = this.game.add.sprite(32, game.world.height / 2, 'human')
    player.weapons = weapons
    player.currentWeapon = 0

    weapons.push(new Weapon.SingleBullet(this.game));
    weapons.push(new Weapon.Beam(this.game));


    //  We need to enable physics on the player
    game.physics.arcade.enable(player)

    game.camera.follow(player)


    cursors = game.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  }



  function update(){

    // game.physics.arcade.collide(this.player, this.collisionLayer);
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
