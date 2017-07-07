import io from 'socket.io-client'
import game from './game/index'

const socket = io('http://localhost:4000')


socket.askNewPlayer = function(){
    socket.emit('newplayer')
}

socket.sendClick = function(x,y){
  socket.emit('click',{x:x,y:y})
}

socket.on('newplayer', function(data){
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
