/* Add player class to handle logic of people jumping in and out of the game */
  //need to pass in game object

//extend group or sprites?

class Player extends Phaser.group {
  constructor(game,x,y,health,speed,avatar){
    super(game)
    this.game = game
    this.health = 50
    this.speed = 5
    this.avatar = 'zombie'
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
