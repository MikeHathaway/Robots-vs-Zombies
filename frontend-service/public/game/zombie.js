// const Enemy = function(game,gameWidth,gameHeight){
//   game.add.sprite(genRandomNum(gameWidth),genRandomNum(gameHeight),'zombie')
// }

//http://metroid.niklasberg.se/2016/02/12/phaser-making-and-using-a-generic-enemy-class-es6es2015/

class Enemy extends Phaser.Sprite{
  constructor(game,x,y,type){
    super(game,0,0,'zombie')
    this.x = genRandomNum(x)
    this.y = genRandomNum(y)
    this.type = type
    this.enableBody = true
    this.physicsBodyType = Phaser.Physics.ARCADE
  }

  hitEnemy(player, enemy){
    enemy.kill();
    console.log("Hit");
  }

  spawnEnemy(game,x,y){
    game.add.sprite(genRandomNum(x),genRandomNum(y),'zombie')
  }

  move(){

  }
}

function genRandomNum(factor){
  return Math.floor(factor * Math.random())
}
