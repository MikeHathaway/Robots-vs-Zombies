const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io').listen(server)

const serverHandlers = require('./serverHandlers')(io)
//const game = require('./phaser') // <- server side phaser hack
//const config = require('./config.json')


app.get('/test', (req,res) => {
  res.send('hello!')
})

server.listen(process.env.PORT || 4000, function(){
    console.log('Listening on '+server.address().port)
})


const updateInterval = 100

function init(){
  setInterval(broadcastingLoop,updateInterval)
}


function broadcastingLoop() {
	for(var g in games) {
		var game = games[g];
		for(var i in game.players) {
			var player = game.players[i];
			if(player.alive && player.hasMoved) {
				io.to(g).emit("m", {id: player.id, x: player.x, y: player.y, f: player.facing});
				player.hasMoved = false;
			}
		}
	}
};
