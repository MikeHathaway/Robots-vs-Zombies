class Player extends Phaser.Sprite{
  constructor(game,x,y,avatar,health,speed,weapons,id,gameID){
    super(game,x,y,avatar)
    this.game = game
    this.x = x
    this.y = y
    this.health = health || 50
    this.maxHealth = health
    this.speed = speed || 5
    this.avatar = 'zombie'
    this.weapons = weapons
    this.id = id
    this.gameID = gameID
    this.currentWeapon = 0
    // this.anchor.setTo(0.5, 0.5) // <- purpose?

    game.physics.enable(this)
    this.body.velocity.x = 10
    this.body.velocity.y = 10
    // this.body.collideWorldBounds = true;
  }


  removePlayer(game,id){
    game.playerMap[id].destroy()
    delete game.playerMap[id]
  }

  takeDamage(damage){
    this.health -= damage

    if(this.health <= 0){
      this.health = 0
      this.alive = false
      this.kill()
      return true
    }
    return false
  }

}


export default Player
