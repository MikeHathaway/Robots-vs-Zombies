//https://www.codementor.io/codementorteam/socketio-multi-user-app-matchmaking-game-server-2-uexmnux4p


  /*
    {
      lobbyID1: [player1, player2],
      lobbyID2: [player1, player2],
    }
  */

const io = global._io
// const Game = global._io

/** Store access to game instance variables within the game instance */
const game = require('../models/Game')
const Game = new game.Game()

const players = []
const enemies = []


Game.gameSessions = {}
Game.gameSessions.lastRoomID = 0

//initalize lobby list of players
Game.gameSessions[Game.gameSessions.lastRoomID] = []

module.exports = {
  onNewGame,
  onJoinGame,
  onGameOver
}


function onJoinGame(data){
  const currGameLobby = Game.gameSessions[Game.gameSessions.lastRoomID]
  const socketID = this.id
  console.log('currGameLobby',currGameLobby, this.id)

  if(checkRoomSize(currGameLobby)){
    io.sockets.emit('newGame',{id: socketID, gameID: Game.gameSessions.lastRoomID})
    return currGameLobby.push(socketID)
  }
  else{
    // if no open game, start a new room
    io.sockets.emit('newGame',{id: socketID, gameID: Game.gameSessions.lastRoomID})
    return currGameLobby.push(socketID)
  }
}


function onNewGame(){
  Game.gameSessions[Game.gameSessions.lastRoomID] = []
}


function onGameOver(data){

  console.log('starting new game')
  players.length = 0
  // enemies.length = 0
  console.log(players)
}


function checkRoomSize(gameLobby){
  // if(Array.isArray(gameLobby))

  if(gameLobby.length <= 4){
    return true
  }

  //start a new game lobby
  Game.gameSessions.lastRoomID++
  Game.gameSessions[Game.gameSessions.lastRoomID] = []
  return false
}
