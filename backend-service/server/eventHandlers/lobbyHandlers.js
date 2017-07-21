//https://www.codementor.io/codementorteam/socketio-multi-user-app-matchmaking-game-server-2-uexmnux4p

const io = global._io
const Game = global._Game

module.exports = {
  onNewGame,
  onJoinGame,
  onGameOver
}


function onJoinGame(data){
  const currGameLobby = initalizeGameData()
  const socketID = this.id

  if(checkRoomSize(currGameLobby)){
    io.sockets.emit('newGame',{id: socketID, gameID: Game.getRoomID().toString()})
  }
  // if no open game, start a new room
  else{
    Game.setRoomID()
    initalizeGameData()
    io.sockets.emit('newGame',{id: socketID, gameID: Game.getRoomID().toString()})
  }
}

function initalizeGameData(){
  const roomID = Game.getRoomID().toString()
  if(!Game.gameSessions[roomID]){
    Game.gameSessions[roomID] = {}
    Game.gameSessions[roomID].players = []
    Game.gameSessions[roomID].enemies = []
    return Game.gameSessions[roomID].players
  }
    return Game.gameSessions[roomID].players
}

//check that only 4 people in a game
function checkRoomSize(gameLobby){
  return gameLobby.length < 3 ? true : false
}





//function may be unnecessary
function onNewGame(){
  Game.gameSessions[Game.gameSessions.lastRoomID] = []
}


function onGameOver(data){
  console.log('GAME OVER',Game.gameSessions, Game.gameSessions[data.gameID])
  const gameObj = Game.gameSessions[data.gameID]
  gameObj.players.length = 0
  gameObj.enemies.length = 0

  //emit new game with check for available instance?
  io.sockets.emit('gameOver', {gameID: data.gameID})

  Game.setRoomID()

}
