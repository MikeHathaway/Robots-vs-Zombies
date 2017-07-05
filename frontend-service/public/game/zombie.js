// const Enemy = function(game,gameWidth,gameHeight){
//   game.add.sprite(genRandomNum(gameWidth),genRandomNum(gameHeight),'zombie')
// }

//http://metroid.niklasberg.se/2016/02/12/phaser-making-and-using-a-generic-enemy-class-es6es2015/

class Enemy extends Phaser.Sprite{
  constructor(game,x,y,type){
    super(game,0,0,'zombie')
    this.x = genRandomNum(x)
    this.y = genRandomNum(y)
    this.speed = 2
    this.type = type
    game.physics.enable(this)

    // this.enableBody = true
    // this.body.allowGravity = false
    // this.physicsBodyType = Phaser.Physics.ARCADE
  }

  spawnEnemy(game,x,y){
    game.add.sprite(genRandomNum(x),genRandomNum(y),'zombie')
  }

  move(){
    this.x = genRandomNum(this.speed)
    this.y = genRandomNum(this.speed)
  }

  update(){
    this.game.physics.arcade.collide(this, this.game.collisionLayer);

    // if (this.body.blocked.right) {
    //   this.scale.x = -1;
    //   this.body.x = genRandomNum(this.speed)
    // } else if (this.body.blocked.left) {
    //   this.scale.x = 1;
    //   this.body.velocity.x = genRandomNum(this.speed)
    // }
  }
}

function genRandomNum(factor){
  return Math.floor(factor * Math.random())
}
