//Inspired by: https://github.com/ahung89/bomb-arena/blob/master/server/entities/game.js

class Game {
  constructor(){
    this.gameSessions = {}

    //need to hash the roomID
    this.lastRoomID = 0
    this.lastEnemyId = 0


    // This is used to keep track of how many players have acknowledged readiness for a round, to avoid
    // extra socket messages from causing weird behavior.
    this.roundReadyAcknowledgements = []
    this.awaitingAcknowledgements = false

    //this.numRounds = DEFAULT_NUM_ROUNDS
    this.currentRound = 1
  }

  getNumPlayers(){
    return Object.keys(this.players).length
  }

  getRoomID(){
    return this.lastRoomID
  }

  setRoomID(){
    return this.lastRoomID++
  }

  findOpenGame(){
    //check each game session for a players.length < 3
  }

}

exports.Game = Game
