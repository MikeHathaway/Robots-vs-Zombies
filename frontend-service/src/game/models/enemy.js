//http://metroid.niklasberg.se/2016/02/12/phaser-making-and-using-a-generic-enemy-class-es6es2015/

//https://phaser.io/examples/v2/games/tanks

//http://www.html5gamedevs.com/topic/14281-help-needed-for-better-enemy-ai/
  //^add functionality for more sophisticated enemy ai


class Enemy extends Phaser.Sprite{
  constructor(game,x,y,type,id){
    super(game,0,0,'zombie')
    this.x = genRandomNum(x)
    this.y = genRandomNum(y)
    this.speed = 2
    this.type = type
    this.health = 30
    this.id = id
    game.physics.enable(this)
  }

  spawnEnemy(game,x,y){
    game.add.sprite(genRandomNum(x),genRandomNum(y),'zombie')
  }

  move(game,enemy,player){
    game.physics.arcade.moveToObject(enemy, player, 60, 0);
  }

  isAlive(){
    if(this.health <= 0) {
      return false
    }
    return true
  }

  takeDamage(damage){
    this.health -= damage
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

function genMovement(factor){
  return Math.floor(factor * (Math.round(Math.random()) * 2 - 1))
}

export default Enemy
