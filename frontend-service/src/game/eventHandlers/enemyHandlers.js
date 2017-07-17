import {socket, playerObs} from './index'
import Enemy from '../models/enemy'
import game from '../game'


const enemyMap = []
//const enemies = game.add.group()

/** ADD ENEMIES */
function onNewEnemies(data){
  console.log('new enemies to add!', data.enemyList)
  // enemies.push(data) <- make it game.enemies?
  playerObs.emit('addEnemies', data)
  // data.enemyList.forEach(enemy => enemies.push(enemy))
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
      /* REGAIN ACCESS TO ENEMIES GROUP */
      //enemies.add(newEnemy)

      return enemyMap.push(newEnemy)
    })
  }
}


/** SHOOT ENEMIES */
function onEnemyShot(data){
  console.log('enemy shot',data)
}



/** MOVE ENEMIES */
//need to modify this to accept enemy collection
function sendEnemyMovement(enemy){
  socket.emit('moveEnemy',{id: enemy.id, x: enemy.body.x, y: enemy.body.y})
}

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

function moveRemoteEnemy(){
  playerObs.on('movingEnemy', moveEnemyOperation)
}

function moveEnemyOperation(moveEnemy){
  console.log('moving enemy id',moveEnemy.data.id)
  const enemy = enemyById(moveEnemy.data.id)

  const xCord = moveEnemy.data.x
  const yCord = moveEnemy.data.y

  const distance = Phaser.Math.distance(enemy.body.x,enemy.body.y,xCord,yCord)
  const tween = game.add.tween(enemy)
  tween.to({x:xCord,y:yCord}, 0)
  tween.start()
}



function enemyById (id) {
  const identifiedEnemy = enemyMap.filter(enemy => enemy.id === id)
  return identifiedEnemy.length > 0 ? identifiedEnemy[0] : false
}



const enemyHandlers = {onNewEnemies,onMoveEnemy,onEnemyShot, addRemoteEnemies, sendEnemyMovement, moveRemoteEnemy}
export default enemyHandlers
