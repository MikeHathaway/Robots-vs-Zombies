/*
current topdown tutorial
  https://www.programmingmind.com/phaser/topdown-layers-moving-and-collision
*/

//https://www.joshmorony.com/create-a-running-platformer-game-in-phaser-with-tilemaps/
  //use tiled to generate tile maps for the gameplay

(function startGame(){

  const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
      preload: preload,
      create: create,
      update: update,
      render: render
  })

  function preload(){
    game.load.tilemap('desert', 'assets/tilemaps/desert.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.image('tiles', 'assets/tilemaps/tmw_desert_spacing.png')
    game.load.image('zombie', 'assets/Zombie_Sprite.png')
    game.load.spritesheet('zombies', 'assets/zombie_sheet.png', 32, 48)
  }


  let map
  let layer
  let player
  let cursors
  let collisionLayer //not yet hooked up - need to properly reference in tilemap

  function create(){

    game.physics.startSystem(Phaser.Physics.ARCADE)

    map = game.add.tilemap('desert')
    // map = this.game.add.tilemap('desert')
    console.log('!!!!!!!!',this,map)


    map.addTilesetImage('Desert', 'tiles')

    layer = map.createLayer('Ground')

    layer.resizeWorld()

    player = this.game.add.sprite(32, game.world.height - 150, 'zombie')

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

  }

  function update(){

    //game.physics.arcade.collide(this.player, this.collisionLayer);
    console.log(this)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    player.body.angularVelocity = 0;

    if (cursors.left.isDown)
    {
        player.body.angularVelocity = -200;
    }
    else if (cursors.right.isDown)
    {
        player.body.angularVelocity = 200;
    }

    if (cursors.up.isDown)
    {
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 300));
    }

  }

  function render(){

  }

})()
