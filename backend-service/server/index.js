const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io').listen(server)

const serverHandlers = require('./serverHandlers')(io)

app.get('/test', (req,res) => {
  res.send('hello!')
})

server.listen(process.env.PORT || 4000, function(){
    console.log('Listening on '+server.address().port)
})
