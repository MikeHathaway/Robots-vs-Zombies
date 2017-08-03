//https://artillery.io/docs/testing_socketio.html#emit
'use strict';

const newPlayer = require('./tests/newPlayer')

console.log(newPlayer)

module.exports = {
  setPlayer: newPlayer
}
