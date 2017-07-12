const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io').listen(server)

const Player = require('./models/Player').Player
const Bullet = require('./models/Bullet').Bullet
const players = []
const bullets = []

let gSocket = null

app.get('/test', (req,res) => {
  res.send('hello!')
})

server.listen(process.env.PORT || 4000, function(){
    console.log('Listening on '+server.address().port)
})


io.sockets.on('connection', setEventHandlers)

function setEventHandlers(client){
  gSocket = client
  console.log('connected!')
  client.on('newPlayer', onNewPlayer)
  client.on('movePlayer', onMovePlayer)
  client.on('shoot', onShoot)
  client.on('disconnect', onSocketDisconnect)
  client.on('test', (data) => { console.log(data)})
}

function onNewPlayer(data) {
  const newPlayer = new Player(data.x, data.y)
  newPlayer.id = this.id

  console.log('new played added: ', this.id)

  //formely this.broadcast.emit
  io.sockets.emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

  players.forEach(player => {
    this.emit('newPlayer', {id: player.id, x: player.getX(), y: player.getY()})
  })

  players.push(newPlayer);

}

function onMovePlayer(data) {
  const movePlayer = playerById(data.id);

  if (!movePlayer) {
      console.log("Player not found: " + data.id)
      return
  }
  console.log('moving player: ', data.id, data.x)

  movePlayer.setX(data.x)
  movePlayer.setY(data.y)
  // formerly this.broadcast.emit
    // had semi broken movement animation with io.sockets.emit
  this.broadcast.emit("movePlayer", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
}

function onShoot(data){
  console.log(data.id, ' is shooting!')
  console.log(data)
  // const bullet = new Bullet(Object.keys(bullets).length, data.id, data.x, data.y, data.v, data.r, data.tr);
  const bullet = new Bullet(Object.keys(bullets).length, data.id, data.x, data.y, data.v, data.r);
  bullets.push(bullet);
  this.broadcast.emit('shoot', bullet);
  this.emit('shoot', bullet);
}

function onSocketDisconnect() {
  console.log("Player has disconnected: " + this.id)

  const removePlayer = playerById(this.id)
  if (!removePlayer) {
      console.log("Player not found: " + this.id)
      return
  }
  players.splice(players.indexOf(removePlayer), 1)
  this.broadcast.emit('removePlayer', {id: this.id})
  // io.emit('removePlayer', "A user disconnected");
}


setInterval (function () {
    // For each Players go through the bullets if any contact report.
	for (let i=0; i < bullets.length; ++i){
		const bullet = bullets[i];
		if (!bullet) continue;
		for (let id2 in players) {
			const player = players[id2];
			if (!player || player.id == bullet.pid) continue;
			elapsedTime = (Date.now() - bullet.dt) / 1000;
			//console.log("elapsedTime: " + elapsedTime);

			//console.log("radians:"+bullet.r/Math.PI);
			let theta = bullet.r
			const x = Math.round(bullet.x+(Math.cos(theta) * bullet.v) * elapsedTime);
			const y = Math.round(bullet.y+(Math.sin(theta) * bullet.v) * elapsedTime);
			console.log("x:"+x+",y:"+y);
			if (x < -1000 || x > 1000 || y < -1000 || y > 1000){
				console.log("x:"+x+",y:"+y+",bullet.r:"+bullet.r+",bullet.v:"+bullet.v);
				bullets.splice(bullet,1);
				delete bullet;
				continue;
			}
			//console.log("radians2:"+player.r);

      theta = player.r;
			const p1 = rotatePoint(30,30, player.x,player.y,theta);
			const p2 = rotatePoint(-30,-30, player.x,player.y,theta);
			if (pointRectangleIntersection({x:x,y:y},
			    {x1:Math.min(p1.x,p2.x),x2:Math.max(p1.x,p2.x),
           y1:Math.min(p1.y,p2.y), y2:Math.max(p1.y, p2.y)}))
			{
				bullet.hid = player.id;
				console.log("PLAYER HIT!!!!!!!");
				const packet = {bullet:bullet, targetHealth:--player.health, srcScore:++player.score};
				gSocket.broadcast.emit('shot',packet);
				gSocket.emit('shot',packet);
				bullets.splice(bullet,1);
				delete bullet;
				continue;
			}

		}
	}
}, 32); // 30 FPS

function rotatePoint(px,py,ox,oy,theta){
	const rx = Math.round(px*Math.cos(theta) - py*Math.sin(theta));
	const ry = Math.round(px*Math.sin(theta) + py*Math.cos(theta));
	return {x:ox + rx, y:oy + ry};
}

function pointRectangleIntersection(p, r) {
    console.log("p.x:"+p.x+",p.y:"+p.y);
    console.log("x1:"+r.x1+",y1:"+r.y1+",x2:"+r.x2+",y2:"+r.y2);
    return p.x >= r.x1 && p.x <= r.x2 && p.y >= r.y1 && p.y <= r.y2;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function playerById (id) {
  const identifiedPlayer = players.filter(player => player.id === id)
  return identifiedPlayer.length > 0 ? identifiedPlayer[0] : false
}
