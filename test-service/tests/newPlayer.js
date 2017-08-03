'use strict';

const strGenerator = generateRandomStr()

const player = {
  x: 500,
  y: 500,
  id: callGenerator(),
  gameID: '0'
}

function setPlayer(context, events, done) {
  // make it available to templates as "player"
  context.vars.player = player
  return done()
}

function* generateRandomStr(){
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  yield possible.charAt(Math.floor(Math.random() * possible.length))
}


function callGenerator(){
  let str = ''
  while(str.length < 8){
    const nextChar = strGenerator.next().value
    console.log('nextChar',nextChar)
    str = str.concat(nextChar)
  }
  console.log('outputstr!', str)
  return str
}

console.log('Generated Player: ',player)
module.exports = setPlayer
