import {client, playerObs} from './index'
import Enemy from '../models/enemy'
import game from '../states/game'

import * as most from 'most'



const enemyMap = []
//const enemies = game.add.group()

/** ADD ENEMIES */
function onNewEnemies(data){
  console.log('new enemies to add!', data.enemyList, enemyMap.length)
  if(data.enemyList){
    if(enemyMap.length < data.enemyList.length) {
      playerObs.emit('addEnemies', data)
    }
  }
}

//potentially utilize once?
function addRemoteEnemies(){
  playerObs.on('addEnemies', addEnemyOperation)
}

function addEnemyOperation(enemyData){
  if(enemyMap.length < 5){
    enemyData.enemyList.forEach(enemy => {
      const newEnemy = new Enemy(game,enemy.x,enemy.y,enemy.type,enemy.id)
      playerObs.emit('enemyGroup',newEnemy)
      enemyMap.push(newEnemy)
    })
  }
}






/** MOVE ENEMIES */
//need to modify this to accept enemy collection
function sendEnemyMovement(enemy){
  return client.event.emit('moveEnemy',{id: enemy.id, x: enemy.body.x, y: enemy.body.y})
}

function onMoveEnemy(data){
  const moveEnemy = enemyById(data.id);

  if (!moveEnemy) {
      console.log("Enemy (move) not found: " + data.id);
      return;
  }
  // playerObs.emit('movingEnemy', {id: moveEnemy.id, x: moveEnemy.body.x, y: moveEnemy.body.y})
  playerObs.emit('movingEnemy', {id: moveEnemy.id, x: data.x, y: data.y})

}

function moveEnemy(){
  playerObs.on('movingEnemy', moveEnemyOperation)
}

//source of my troubles
function moveEnemyOperation(moveEnemy){
  const enemy = enemyById(moveEnemy.id)
  return game.add.tween(enemy).to({x:moveEnemy.x, y:moveEnemy.y}, 0).start()
}


function enemyById (id) {
  const identifiedEnemy = enemyMap.filter(enemy => enemy.id === id)
  return identifiedEnemy.length > 0 ? identifiedEnemy[0] : false
}





/** SHOOT ENEMIES */
function onEnemyHit(data){
  const enemy = enemyById(data.id)
  console.log('enemy hit',data)

  if(data.alive){
    enemy.health = data.health
  }
  else{
    enemy.health = 0
    enemy.kill()
  }
}



const enemyHandlers = {onNewEnemies,onMoveEnemy, onEnemyHit, addRemoteEnemies, sendEnemyMovement, moveEnemy}
export default enemyHandlers
