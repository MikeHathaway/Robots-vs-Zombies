'use strict';

const gameWidth = 1200
const gameHeight = 1000

const movingEnemy = {
  x: randomInt(0, gameWidth),
  y: randomInt(0, gameHeight),
  id: 'blah',
  gameID: '0'
}

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

console.log('Moving Enemy: ', movingEnemy)
module.exports = movingEnemy
