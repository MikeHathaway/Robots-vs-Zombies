//https://artillery.io/docs/testing_socketio.html#emit
'use strict';

const newPlayerData = require('./newPlayer')
const newEnemyData = require('./newEnemy')
const moveEnemyData = require('./moveEnemy')

module.exports = {
  setPlayer: setPlayer,
  setEnemy: setEnemy,
  moveEnemy: moveEnemy
}


function setPlayer(context, events, done) {
  // make it available to templates as "player"
  context.vars.player = newPlayerData
  return done()
}

function setEnemy(context, events, done){
  // make it available to templates as "newEnemy"
  context.vars.enemy = newEnemyData
  return done()
}

function moveEnemy(context, events, done){
  context.vars.movingEnemy = moveEnemyData
  return done()
}
