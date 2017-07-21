const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io').listen(server)
global._io = io

//attach all lobby information to the same global object
const game = require('./models/Game')
const Game = new game.Game()
global._Game = Game

const eventHandlers = require('./eventHandlers')(io)

app.get('/test', (req,res) => {
  res.send('hello from the game server!')
})

server.listen(process.env.PORT || 4000, function(){
    console.log('Listening on ' + server.address().port)
})
