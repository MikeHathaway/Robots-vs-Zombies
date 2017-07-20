//Inspired by: https://github.com/ahung89/bomb-arena/blob/master/server/entities/game.js

class Game {
  constructor(){
    this.players = {}
    this.map = {}
    this.numPlayersAlive = 0

    //Game as single source of truth?
    this.lastRoomID = 0

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

  getPlayerID(){

  }

  setPlayerID(){

  }

}

exports.Game = Game
