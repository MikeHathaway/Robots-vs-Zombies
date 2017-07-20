//https://www.codementor.io/codementorteam/socketio-multi-user-app-matchmaking-game-server-2-uexmnux4p


  /*
    {
      lobbyID1: [player1, player2],
      lobbyID2: [player1, player2],
    }
  */
const io = global._io


/** Store access to game instance variables within the game instance */
const Game = require('../models/Game')
const players = []
const bullets = []
const enemies = []


const gameSessions = {}
gameSessions.lastRoomID = 0


module.exports = {
  onNewGame,
  onJoinGame,
  onGameOver
}


function onJoinGame(){
  const gameList = gameSessions[gameSessions.lastRoomID]

  if(checkRoomSize(gameSessions[gameSessions.lastRoomID])){
    io.sockets.emit('newGame',{gameID: gameSessions.lastRoomID})
    gameList.push(Game.lastPlayerId)
  }
  
}


function onNewGame(){
  gameSessions[gameSessions.lastRoomID] = []
}



function onGameOver(){
  console.log('starting new game')
  players.length = 0
  enemies.length = 0
  console.log(players,enemies)
}


function checkRoomSize(gameLobby){
  if(gameLobby.length <= 4){
    return true
  }
  gameSessions.lastRoomID++
  return false
}
