class Game {
  constructor(){
    this.gameSessions = {}
    this.lastRoomID = 0 //need to hash the roomID
    this.lastEnemyId = 0
  }

  getRoomID(){
    return this.lastRoomID
  }

  setRoomID(){
    return this.lastRoomID++
  }

}

exports.Game = Game
