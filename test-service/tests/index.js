'use strict';

const newPlayerData = require('./newPlayer')
const newEnemyData = require('./newEnemy')
const moveEnemyData = require('./moveEnemy')


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



module.exports = {
  setPlayer: setPlayer,
  setEnemy: setEnemy,
  moveEnemy: moveEnemy
}
