/*
current topdown tutorial
  https://www.programmingmind.com/phaser/topdown-layers-moving-and-collision
*/

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
})

function preload(){
  game.load.tilemap('desert', '/assets/tilemaps/desert.json', null, Phaser.Tilemap.TILED_JSON)
  game.load.image('tiles', 'assets/tilemaps/tmw_desert_spacing.png')
  game.load.image('zombie', 'assets/Zombie_Sprite.png')
  game.load.spritesheet('zombies', 'assets/zombie_sheet.png', 32, 48)
}

let map
let layer
let zombie
let cursors

function create(){

  game.physics.startSystem(Phaser.Physics.ARCADE)

  map = game.add.tilemap('desert')

  map.addTilesetImage('Desert', 'tiles')

  layer = map.createLayer('Ground')

  layer.resizeWorld()

  player = game.add.sprite(32, game.world.height - 150, 'zombie')

  //  We need to enable physics on the player
  game.physics.arcade.enable(player)

  game.camera.follow(player)


  cursors = game.input.keyboard.createCursorKeys();

}

function update(){

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
