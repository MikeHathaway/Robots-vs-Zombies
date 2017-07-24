class Enemy extends Phaser.Sprite{
  constructor(game,x,y,type,id,gameID){
    super(game,0,0,'zombie')
    this.x = genRandomNum(x)
    this.y = genRandomNum(y)
    this.speed = 100
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

  attack(){
    if (this.game.time.time < this.nextAttack) return 0
    this.nextAttack = this.game.time.time + this.attackSpeed;
    console.log('damage!!',this.damage)
    return this.damage
  }

}

function genRandomNum(factor){
  return Math.floor(factor * Math.random())
}


export default Enemy
