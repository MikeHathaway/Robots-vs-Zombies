//http://www.dynetisgames.com/2017/03/06/how-to-make-a-multiplayer-online-game-with-phaser-socket-io-and-node-js/
//https://github.com/Jerenaux/basic-mmo-phaser/blob/master/js/client.js

import io from 'socket.io-client'
import feathers from 'feathers/client'
import hooks from 'feathers-hooks'
import socketio from 'feathers-socketio/client'
import authentication from 'feathers-authentication-client'
import game from './game/index'

const socket = io('http://localhost:4000')
const client = feathers()

client.configure(hooks())
client.configure(socketio(socket))
client.configure(authentication({
  storage: window.localStorage
}))


client.askNewPlayer = function(){
  socket.emit('newplayer')
}

socket.on('newplayer', function(data){
  console.log(data)
  console.log(game)
  game.addNewPlayer(data.id,data.x,data.y);
})

client.on('newplayer',function(data){
    console.log(data)
    game.addNewPlayer(data.id,data.x,data.y);
})

client.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    client.on('move',function(data){
        game.movePlayer(data.id,data.x,data.y);
    });

    client.on('remove',function(id){
        game.removePlayer(id);
    });
});





export default client
