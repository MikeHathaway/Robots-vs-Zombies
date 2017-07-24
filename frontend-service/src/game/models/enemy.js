class Enemy extends Phaser.Sprite{
  constructor(game,x,y,type,id,gameID){
    super(game,0,0,'zombie','zombieAttack')
    this.x = genRandomNum(x)
    this.y = genRandomNum(y)
    this.speed = 200
    this.attackSpeed = 1500
    this.type = type
    this.health = 30
    this.id = id
    this.gameID = gameID
    this.damage = 10
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

  move(game,enemy,player){
    if(player) game.physics.arcade.moveToObject(enemy, player, this.speed);
  }

}

function genRandomNum(factor){
  return Math.floor(factor * Math.random())
}


export default Enemy
