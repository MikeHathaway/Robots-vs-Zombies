const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io').listen(server)

server.lastPlayderID = 0

server.listen(process.env.PORT || 4000, function(){
    console.log('Listening on '+server.address().port)
})

io.on('connection',function(socket){

    socket.on('newPlayer',function(){
        console.log('new player!')
        socket.player = {
            id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        }
        socket.emit('allplayers',getAllPlayers())
        socket.broadcast.emit('newPlayer', socket.player)

        socket.on('click',function(data){
            console.log('click to ' + data.x +', ' + data.y)
            socket.player.x = data.x
            socket.player.y = data.y
            io.emit('move',socket.player)
        })

        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id)
        })
    })

    socket.on('move_left', function(){
        io.emit("move_left_from_server", socket.player.id)
    })


})


function getAllPlayers(){
    var players = []
    Object.keys(io.sockets.connected).forEach(function(socketID){
      console.log(socketID)
        var player = io.sockets.connected[socketID].player
        if(player) players.push(player)
    })
    return players
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}
