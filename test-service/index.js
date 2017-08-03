//https://artillery.io/docs/testing_socketio.html#emit
'use strict';

const newPlayerData = require('./tests/newPlayer')

module.exports = {
  setPlayer: setPlayer
}


function setPlayer(context, events, done) {
  // make it available to templates as "player"
  context.vars.player = newPlayerData
  return done()
}
