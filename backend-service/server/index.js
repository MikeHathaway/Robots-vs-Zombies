'use strict';

const app = require('../app');
const port = app.get('port');
const server = app.listen(port);

server.lastPlayderID = 0;

server.on('listening', () =>
  console.log(`Feathers application started on ${app.get('host')}:${port}`)
);

server.on('connection', function(socket){

    socket.emit('newplayer', socket.player = {id: server.lastPlayderID++, x: randomInt(100,400), y: randomInt(100,400)})

    socket.on('newplayer',function(){
      console.log('new player!') //not firing for some reason...
        socket.player = {
            id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };
        socket.emit('allplayers',getAllPlayers);
        socket.broadcast.emit('newplayer',socket.player);
        // server.broadcast.emit('newplayer',socket.player);

        socket.on('click',function(data){
            console.log('click to '+ data.x + ', ' + data.y);
            socket.player.x = data.x;
            socket.player.y = data.y;
            server.emit('move',socket.player);
        });

        socket.on('disconnect',function(){
            server.emit('remove',socket.player.id);
        });
    });

    socket.on('test',function(){
        console.log('test received');
    });
});

function getAllPlayers(){
    var players = [];
    Object.keys(server.sockets.connected).forEach(function(socketID){
        var player = server.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    console.log(players)
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
