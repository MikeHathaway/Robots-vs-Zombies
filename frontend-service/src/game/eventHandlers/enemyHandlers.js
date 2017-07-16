import {playerObs} from './index'

const enemies = []

function onNewEnemies(data){
  console.log('new enemies to add!', data.enemyList)
  // enemies.push(data) <- make it game.enemies?
  playerObs.emit('addEnemies', data)
  data.enemyList.forEach(enemy => enemies.push(enemy))
}


//need to modify this to accept enemy collection
function onMoveEnemy(data){
  const moveEnemy = enemyById(data.id);
  // return moveEnemy ? playerObs.emit('movingEnemy', {enemy: moveEnemy, data: data}) : false

  if (!moveEnemy) {
      console.log("Enemy (move) not found: " + data.id);
      return;
  }

  console.log('move enemy received', moveEnemy, data)

  //need to reduce quantity of information being transported
  // playerObs.emit('movingEnemy', {enemy: moveEnemy, data: data})
  playerObs.emit('movingEnemy', {data: data})

}

function onEnemyShot(data){
  console.log('enemy shot',data)
}



function enemyById (id) {
  const identifiedEnemy = enemies.filter(enemy => enemy.id === id)
  return identifiedEnemy.length > 0 ? identifiedEnemy[0] : false
}


const playerHandlers = {onNewEnemies,onMoveEnemy,onEnemyShot}
export default playerHandlers
