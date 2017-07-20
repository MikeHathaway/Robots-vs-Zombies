//https://www.codementor.io/codementorteam/socketio-multi-user-app-matchmaking-game-server-2-uexmnux4p

const io = global._io

/** Store access to game instance variables within the game instance */
const game = require('../models/Game')
const Game = new game.Game()

const players = []
const enemies = []

/** Initalize Lobby */
Game.gameSessions = {}
Game.gameSessions.lastRoomID = 0
Game.gameSessions[Game.gameSessions.lastRoomID] = []


module.exports = {
  onNewGame,
  onJoinGame,
  onGameOver
}


function onJoinGame(data){
  // const currGameLobby = Game.gameSessions[Game.gameSessions.lastRoomID]
  const currGameLobby = Game.gameSessions[Game.getRoomID()]
  console.log('joing room: ',Game.getRoomID(), currGameLobby)
  const socketID = this.id

  if(checkRoomSize(currGameLobby)){
    io.sockets.emit('newGame',{id: socketID, gameID: Game.getRoomID()})
    return currGameLobby.push(socketID)
  }
  // if no open game, start a new room
  else{
    Game.setRoomID()
    Game.gameSessions[Game.getRoomID()] = []

    io.sockets.emit('newGame',{id: socketID, gameID: Game.getRoomID()})
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
  return gameLobby.length < 3 ? true : false
}
