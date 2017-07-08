//http://www.dynetisgames.com/2017/03/06/how-to-make-a-multiplayer-online-game-with-phaser-socket-io-and-node-js/
//https://github.com/Jerenaux/basic-mmo-phaser/blob/master/js/client.js

//https://gamedev.stackexchange.com/questions/124434/phaser-io-with-socket-io-what-should-the-server-calculate-and-what-the-client

//https://github.com/fbaiodias/phaser-multiplayer-game

import io from 'socket.io-client'

const socket = io('http://localhost:4000')


socket.askNewPlayer = function(){
    socket.emit('newPlayer')
}



socket.sendMove = function(player,direction){
  socket.emit(`${direction}`, player)
}

socket.sendFire = function(x,y){
  socket.emit('click',{x:x,y:y})
}



socket.on('newPlayer', function(data){
    game.addNewPlayer(data.id,data.x,data.y)
})

socket.on('allplayers', function(data){
    data.forEach(player => {
      game.addNewPlayer(player.id,player.x,player.y)
    })

    socket.on('move', function(data){
        game.movePlayer(data.id,data.x,data.y)
    })

    socket.on('remove', function(id){
        game.removePlayer(id)
    })
})


export default socket
