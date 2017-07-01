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

// import { Weapon } from "game/weapon"

(function startGame(){

  const game = new Phaser.Game(1000, 800, Phaser.AUTO, 'game-container', {
      preload: preload,
      create: create,
      update: update,
      render: render
  })

  function preload(){
    //game.load.crossOrigin = 'anonymous'

    game.load.tilemap('desert', './game/assets/tilemaps/desert.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.image('tiles', './game/assets/tilemaps/tmw_desert_spacing.png')
    game.load.image('zombie', './game/assets/Zombie_Sprite.png')
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

  function changeWeapon(player){
    if(player.currentWeapon === 1){
      player.currentWeapon = 0
    }

    if(player.currentWeapon === 0){
      player.currentWeapon = 1
    }

  }


  function create(){

    game.physics.startSystem(Phaser.Physics.ARCADE)

    map = game.add.tilemap('desert')


    map.addTilesetImage('Desert', 'tiles')

    layer = map.createLayer('Ground')

    layer.resizeWorld()

    player = this.game.add.sprite(32, game.world.height - 150, 'zombie')
    player.weapons = weapons
    player.currentWeapon = 0

    weapons.push(new Weapon.SingleBullet(this.game));
    weapons.push(new Weapon.Beam(this.game));

    // next create the collision layer - this will abstract away all the areas that cant be moved over
    collisionLayer = map.createLayer('Collision');

    // collisionLayer.visible = false;

    // inform phaser that our collision layer is our collision tiles
    // in our case, since we separated out the collision tiles into its own layer
    // we pass an empty array and passing in true to enable collision
    map.setCollisionByExclusion([], true, collisionLayer);


    //  We need to enable physics on the player
    game.physics.arcade.enable(player)

    game.camera.follow(player)


    cursors = game.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  }

  function update(){

    //game.physics.arcade.collide(this.player, this.collisionLayer);
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    player.body.angularVelocity = 0;

    if (cursors.left.isDown){
        player.body.angularVelocity = -200;
    }
    else if (cursors.right.isDown){
        player.body.angularVelocity = 200;
    }

    if (cursors.up.isDown){
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 300));
    }

    if (fireButton.isDown){
      console.log('pew pew pew')
      // weapon.fire()
      player.weapons[player.currentWeapon].fire(player);
    }

    if(changeKey.isDown){
      changeWeapon(player)
    }



  }

  function render(){

  }

})()
