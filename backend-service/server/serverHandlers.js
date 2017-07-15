const Game = require('./models/Game')
const Player = require('./models/Player').Player
const Bullet = require('./models/Bullet').Bullet
const Enemy = require('./models/Enemy').Enemy

const players = []
const bullets = []
const enemies = []

const game = {} // <- will be a reference to the server side headless phaser
game.lastEnemyId = 0

let gSocket = null

module.exports = function(io){

  //formerly io.sockets.on('connection', setEventHandlers)
  //define a single namespace through which to connect (enabling multiplexing)
  io.of('/').on('connection', setEventHandlers)

  function setEventHandlers(client){
    gSocket = client
    console.log('connected!')
    client.on('newPlayer', onNewPlayer)
    client.on('newEnemies', onNewEnemies)
    client.on('movePlayer', onMovePlayer)
    client.on('moveEnemy', onMoveEnemy)
    client.on('shoot', onShoot)
    client.on('disconnect', onSocketDisconnect)
    client.on('test', (data) => { console.log(data)})
  }

  function onNewPlayer(data) {
    const newPlayer = new Player(data.x, data.y)
    newPlayer.id = this.id

    console.log('new played added: ', this.id)

    console.log('emitting!!')

    //formely this.broadcast.emit
    io.sockets.emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

    players.forEach(player => {
      this.emit('newPlayer', {id: player.id, x: player.getX(), y: player.getY()})
    })

    players.push(newPlayer);
  }


  function onNewEnemies(data){
    console.log(enemies.length)
    //ensure that enemies are only added once
    if(enemies.length === 0){
      let currentNum = 0
      console.log(data, game.lastEnemyId)
      while(currentNum++ < data.number){
        const newEnemy = new Enemy(game.lastEnemyId, data.x, data.y)
        game.lastEnemyId++
        enemies.push(newEnemy)
      }
    }
    // io.sockets.emit('newEnemy', {id: newEnemy.id, x: newEnemy.x, y: newEnemy.y})
    io.sockets.emit('newEnemies', {enemyList: enemies})
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


  function onMoveEnemy(data){
    const moveEnemy = enemyById(data.id)

    if (!moveEnemy) {
        console.log("Enemy not found: " + data.id)
        return
    }

    moveEnemy.setX(data.x)
    moveEnemy.setY(data.y)

    io.sockets.emit('moveEnemy', {id: moveEnemy.id, x: moveEnemy.x, y: moveEnemy.y})

  }


  function onShoot(data){
    console.log(data.id, ' is shooting!')
    const bullet = new Bullet(Object.keys(bullets).length, data.id, data.x, data.y, data.v, data.r);
    bullets.push(bullet);
    // console.log('checking collisions!',checkCollisions)
    this.volatile.broadcast.emit('shoot', bullet);
    this.volatile.emit('shoot', bullet);
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
    io.emit('removePlayer', "A user disconnected");
  }





  //const checkCollisions =
  setInterval (function () {
      // For each Players go through the bullets if any contact report.
  	for (let i=0; i < bullets.length; ++i){
  		const bullet = bullets[i];
  		if (!bullet) continue;
  		for (let id2 in enemies) {
  			const enemy = enemies[id2];
        console.log(enemy)
  			if (!enemy || enemy.id == bullet.pid) continue;
  			let elapsedTime = (Date.now() - bullet.dt) / 1000;
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

        theta = enemy.r;
  			const p1 = rotatePoint(30,30, enemy.x,enemy.y,theta);
  			const p2 = rotatePoint(-30,-30, enemy.x,enemy.y,theta);
  			if (pointRectangleIntersection({x:x,y:y},
  			    {x1:Math.min(p1.x,p2.x),x2:Math.max(p1.x,p2.x),
             y1:Math.min(p1.y,p2.y), y2:Math.max(p1.y, p2.y)}))
  			{

          /*  Bullet is passing the intersection check */
  				bullet.hid = enemy.id;
  				console.log("Enemy HIT!!!!!!!");
  				const packet = {bullet: bullet, enemy: enemy, targetHealth: --enemy.health} //, srcScore: ++player.score};
  				gSocket.volatile.broadcast.emit('shot',packet);
  				gSocket.volatile.emit('shot',packet);
  				bullets.splice(bullet,1);
  				delete bullet;
  				continue;
  			}

  		}
  	}
  }, 32); // 30 FPS
}



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

function enemyById (id) {
  const identifiedEnemy = enemies.filter(enemy => enemy.id === id)
  return identifiedEnemy.length > 0 ? identifiedEnemy[0] : false
}
