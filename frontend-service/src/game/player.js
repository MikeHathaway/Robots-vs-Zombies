/* Add player class to handle logic of people jumping in and out of the game */
  //need to pass in game object

//extend group or sprites?
// class Player extends Phaser.group {

class Player extends Phaser.Sprite{
  constructor(game,x,y,health,speed,id,avatar){
    super(game)
    this.game = game
    this.x = x
    this.y = y
    this.health = health || 50
    this.speed = speed || 5
    this.id = id
    this.avatar = 'zombie'
    game.physics.enable(this)
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

}


export default Player
