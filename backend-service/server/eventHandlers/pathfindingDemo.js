
//https://github.com/qiao/PathFinding.js
//https://github.com/prettymuchbryce/easystarjs
// function onMoveEnemy(data){
//   const moveEnemy = enemyById(data.id,data.gameID) //send gameID as well
//   const roomID = data.gameID.toString()
//
//   if (!moveEnemy) {
//       // console.log("Enemy (move) not found: " + data.id)
//       return
//   }
//
//   // const gridClone = grid.clone()
//
//   const enemyRange = moveEnemy.speed * 60
//   const target = identifyTarget(moveEnemy)
//
//   //console.log('PATH COORDINATES',moveEnemy.x, moveEnemy.y, target.getX(),target.getY())
//
//   if(target.getX() < gameWidth - 100 && target.getY() < gameHeight - 100){
//     const path = finder.findPath(Math.floor(moveEnemy.x), Math.floor(moveEnemy.y), Math.floor(target.getX()), Math.floor(target.getY()), grid)
//     if(path[3]){
//       console.log('place to move', path[0][0], path[0][1])
//       io.sockets.in(roomID).emit('moveEnemy', {id: moveEnemy.id, x: path[3][0], y: path[3][1]})
//     }
//   }
// }
//
//
// function identifyTarget(enemy){
//   const gamePlayers = gameSessions[enemy.gameID].players
//   return gamePlayers[0]
// }
//
//
// function movementInterval(){
//   return setInterval()
// }
//
//
// function decideToMove(enemy, enemyRange){
//   const gamePlayers = gameSessions[enemy.gameID].players
//   // console.log('TARGET',gamePlayers[0])
//   return gamePlayers[0]
//   // for(let i = 0; i < gamePlayers.length; i++){
//   //   if(
//   //     Math.floor(enemy.x) - Math.floor(gamePlayers[i].getX()) < enemyRange ||
//   //     Math.floor(enemy.y) - Math.floor(gamePlayers[i].getY()) < enemyRange
//   //      ){
//   //       //console.log('true')
//   //      return gamePlayers[i]
//   //    }
//   //     return -1
//   // }
// }

// function onMoveEnemy(data){
//   const moveEnemy = enemyById(data.id,data.gameID) //send gameID as well
//   const roomID = data.gameID.toString()
//
//   if (!moveEnemy) {
//       // console.log("Enemy (move) not found: " + data.id)
//       return
//   }
//
//   const enemyRange = moveEnemy.speed * 60
//
//   const target = decideToMove(moveEnemy,enemyRange)
//
//   if(target !== -1){
//     identifyNextPosition(moveEnemy,enemyRange,gameSessions[moveEnemy.gameID].players[target])
//     io.sockets.in(roomID).emit('moveEnemy', {id: moveEnemy.id, x: moveEnemy.x, y: moveEnemy.y})
//   }
// }



// && check that they are also within y range
function identifyNextPosition(enemy,enemyRange,player){
  if(Math.floor(Math.random() * 2) === 1){
    // enemy.isMoving = true
    if((Math.floor(enemy.x) - Math.floor(player.getX())) < enemyRange) return enemy.x += enemy.speed
    if((Math.floor(enemy.x) + Math.floor(player.getX())) > enemyRange) return enemy.x -= enemy.speed
  }
  else {
    // enemy.isMoving = true
    if((Math.floor(enemy.y) - Math.floor(player.getY())) < enemyRange) return enemy.y += enemy.speed
    if((Math.floor(enemy.y) + Math.floor(player.getY())) > enemyRange) return enemy.y -= enemy.speed
  }
}

// && enemy.isMoving === false <- check that enemy isn't already moving
// function decideToMove(enemy, enemyRange){
//   const gamePlayers = gameSessions[enemy.gameID].players
//   for(let i = 0; i < gamePlayers.length; i++){
//     if(
//       Math.floor(enemy.x) - Math.floor(gamePlayers[i].getX()) < enemyRange ||
//       Math.floor(enemy.y) - Math.floor(gamePlayers[i].getY()) < enemyRange
//        ){
//         //console.log('true')
//        return i
//      }
//       return -1
//   }
// }
