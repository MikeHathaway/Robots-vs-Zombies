//https://www.codementor.io/codementorteam/socketio-multi-user-app-matchmaking-game-server-2-uexmnux4p

const io = global._io
const Game = global._Game

module.exports = {
  onNewGame,
  onJoinGame,
  onGameOver
}



function onJoinGame(data){
  const roomID = Game.getRoomID().toString()
  // const roomID = placeNewPlayer()
  const socket = this
  const socketID = socket.id

  initalizeGameData(roomID)

  if(checkLobby(roomID)){
    //join specified game instance
    socket.join(roomID)
    io.sockets.in(roomID).emit('newGame',{id: socketID, gameID: roomID})
  }
  // if no open game, start a new room
  else{
    console.log('second game')
    Game.setRoomID()
    const roomID = Game.getRoomID().toString()
    initalizeGameData(roomID)
    socket.join(roomID)
    io.sockets.in(roomID).emit('newGame',{id: socketID, gameID: roomID})
  }
}

//check that lobby is still below level 3
function checkLobby(roomID){
  console.log('checking lobby',Game.gameSessions[roomID])
    if(Game.gameSessions[roomID].level < 3 && Game.gameSessions[roomID].players.length < 4) {
      return true
    }
    return false
}


function placeNewPlayer(){
  if(Object.keys(Game.gameSessions).length > 0){
    return Object.keys(Game.gameSessions).filter(lobby => {
      const gameInstance = Game.gameSessions[lobby]
      if(gameInstance.level <= 3 && gameInstance.players.length < 4){
        console.log(lobby)
        return lobby
      }
    })[0]
  }
  return Game.getRoomID().toString()
}


function initalizeGameData(roomID){
  if(!Game.gameSessions[roomID]){
    Game.gameSessions[roomID] = {}
    Game.gameSessions[roomID].players = []
    Game.gameSessions[roomID].enemies = []
    Game.gameSessions[roomID].bullets = []
    Game.gameSessions[roomID].level = 0
    console.log('first - not',roomID, typeof roomID)
    return roomID
  }
  return Game.gameSessions[roomID]
}

//check that only 4 people in a game
function checkRoomSize(gameLobby){
  return gameLobby.length < 4 ? true : false
}



function cullEmptyRooms(){
  console.log('culling called', Game.gameSessions)
  Object.keys(Game.gameSessions).forEach(lobby => {
    const gameInstance = Game.gameSessions[lobby]
    if(gameInstance.players.length === 0){
      console.log('culling!!!!!!!')
      gameInstance.enemies.length = 0
      gameInstance.bullets.length = 0
    }
  })
}

//check if any rooms should be abandoned after 30 seconds
setInterval(cullEmptyRooms,30000)





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
