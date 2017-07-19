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

  isAlive(){
    if(this.health <= 0) {
      return false
    }
    return true
  }

  takeDamage(damage){
    this.health -= damage
  }
}

function genRandomNum(factor){
  return Math.floor(factor * Math.random())
}


export default Enemy
