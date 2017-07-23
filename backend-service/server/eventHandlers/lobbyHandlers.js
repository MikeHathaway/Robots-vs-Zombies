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
  const socket = this
  const socketID = socket.id

  if(checkRoomSize(currGameLobby)){
    const roomID = Game.getRoomID().toString()
    //join specified game instance
    socket.join(roomID)
    io.sockets.in(roomID).emit('newGame',{id: socketID, gameID: roomID})
    //io.sockets.emit('newGame',{id: socketID, gameID: Game.getRoomID().toString()})
  }
  // if no open game, start a new room
  else{
    Game.setRoomID()
    initalizeGameData()
    const roomID = Game.getRoomID().toString()
    socket.join(roomID)
    io.sockets.in(roomID).emit('newGame',{id: socketID, gameID: roomID})
    // io.sockets.emit('newGame',{id: socketID, gameID: Game.getRoomID().toString()})
  }
}

function initalizeGameData(){
  const roomID = Game.getRoomID().toString()
  if(!Game.gameSessions[roomID]){
    Game.gameSessions[roomID] = {}
    Game.gameSessions[roomID].players = []
    Game.gameSessions[roomID].enemies = []
    Game.gameSessions[roomID].bullets = []
    Game.gameSessions[roomID].level = 0
    return Game.gameSessions[roomID].players
  }
    return Game.gameSessions[roomID].players
}

//check that only 4 people in a game
function checkRoomSize(gameLobby){
  return gameLobby.length < 3 ? true : false
}



function cullEmptyRooms(){
  Object.keys(Game.gameSessions).forEach(lobby => {
    const gameInstance = Game.gameSessions[lobby]
    if(lobby !== 0 && gameInstance.players.length === 0){
      gameInstance.enemies.length = 0
      gameInstance.bullets.length = 0
    }
  })
}

//check if any rooms should be abandoned after 30 seconds
setInterval(cullEmptyRooms,30000)


// function placeNewPlayer(){
//   Object.keys(Game.gameSessions).forEach(lobby => {
//     const gameInstance = Game.gameSessions[lobby]
//     if(gameInstance.players.length === 0){
//       gameIn
//     }
//   })
// }




//function may be unnecessary
function onNewGame(){
  Game.gameSessions[Game.gameSessions.lastRoomID] = []
}


function onGameOver(data){
  console.log('GAME OVER',Game.gameSessions, Game.gameSessions[data.gameID])
  const gameObj = Game.gameSessions[data.gameID]
  const roomID = data.gameID
  gameObj.players.length = 0
  gameObj.enemies.length = 0

  //emit new game with check for available instance?
  io.sockets.in(roomID).emit('gameOver', {gameID: data.gameID})

  Game.setRoomID()

}
