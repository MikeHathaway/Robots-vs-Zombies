/* Add player class to handle logic of people jumping in and out of the game */
  //need to pass in game object

//extend group or sprites?
// class Player extends Phaser.group {

class Player extends Phaser.Sprite{
  constructor(game,x,y,avatar,health,speed,weapons,id){
    super(game,x,y,avatar)
    this.game = game
    this.x = x
    this.y = y
    this.health = health || 50
    this.speed = speed || 5
    this.avatar = 'zombie'
    this.weapons = weapons
    this.id = id
    this.currentWeapon = 0


    // this.anchor.setTo(0.5, 0.5) // <- purpose?

    game.physics.enable(this)

    // game.localPlayer = this
    // game.add.sprite(this.x,this.y,this.avatar)
    this.body.velocity.x = 10
    this.body.velocity.y = 10
    // this.body.collideWorldBounds = true;
  }

  addPlayer(game,id,x,y){
    game.playerMap[id] = game.add.sprite(x,y,'zombie')
  }

  removePlayer(game,id){
    game.playerMap[id].destroy()
    delete game.playerMap[id]
  }

  takeDamage(damage){
    this.health -= damage
  }

  getPlayer(){
    return this
  }

}


export default Player
