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
    client.on('enemyHit', onEnemyHit)
    client.on('disconnect', onSocketDisconnect)
    client.on('test', (data) => { console.log(data)})
  }

  function onNewPlayer(data) {
    const newPlayer = new Player(data.x, data.y)
    newPlayer.id = this.id

    console.log('new played added: ', this.id)

    //formely this.broadcast.emit
    if(players.length === 0){
      console.log('emitting through new player')
      io.sockets.emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

      players.forEach(player => {
        this.emit('newPlayer', {id: player.id, x: player.getX(), y: player.getY()})
      })

      players.push(newPlayer);
    }
    else {
      io.sockets.emit('newPlayer', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

      // send enemies if joining existing game
      io.sockets.emit('newEnemies', {enemyList: enemies})

      players.forEach(player => {
        this.emit('newPlayer', {id: player.id, x: player.getX(), y: player.getY()})
      })

      players.push(newPlayer);
    }
  }


  function onNewEnemies(data){
    //ensure that enemies are only added once
    console.log('on new enemies called', enemies.length,data.number)
    if(enemies.length === 0){
      console.log('first player enemies!')
      addEnemies(data)
      io.sockets.emit('newEnemies', {enemyList: enemies})
    }
    else if(enemies.length === data.number){
      io.sockets.emit('newEnemies', {enemyList: enemies})
    }
  }

  function addEnemies(data){
    let currentNum = 0
    console.log(data, game.lastEnemyId)
    while(currentNum++ < data.number){
      const newEnemy = new Enemy(game.lastEnemyId, randomInt(0,data.x), randomInt(0,data.y))
      game.lastEnemyId++
      enemies.push(newEnemy)
    }
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

    this.broadcast.emit("movePlayer", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
  }


  function onMoveEnemy(data){
    const moveEnemy = enemyById(data.id)

    if (!moveEnemy) {
        console.log("Enemy (move) not found: " + data.id)
        return
    }

    const enemyRange = moveEnemy.speed * 15

    const target = decideToMove(moveEnemy,enemyRange)

    if(target !== -1){
      identifyNextPosition(moveEnemy,enemyRange,players[target])

      io.volatile.sockets.emit('moveEnemy', {id: moveEnemy.id, x: moveEnemy.x, y: moveEnemy.y})
    }
  }

  // && check that they are also within y range
  function identifyNextPosition(enemy, enemyRange,player){
    if(Math.floor(Math.random() * 2) === 1){
      if((Math.floor(enemy.x) - Math.floor(player.getX())) < enemyRange) return enemy.x += enemy.speed
      if((Math.floor(enemy.x) + Math.floor(player.getX())) > enemyRange) return enemy.x -= enemy.speed
    }
    else {
      if((Math.floor(enemy.y) - Math.floor(player.getY())) < enemyRange) return enemy.y += enemy.speed
      if((Math.floor(enemy.y) + Math.floor(player.getY())) > enemyRange) return enemy.y -= enemy.speed
    }
  }

  // function identifyNextPosition(enemy, enemyRange,player){
  //   if(Math.floor(Math.random() * 2) === 1){
  //     if((Math.floor(enemy.x) - Math.floor(player.getX())) < enemyRange && Math.floor(enemy.y) - Math.floor(player.getY()) < enemyRange return enemy.x += enemy.speed
  //     if((Math.floor(enemy.x) + Math.floor(player.getX())) > enemyRange) return enemy.x -= enemy.speed
  //   }
  //   else {
  //     if((Math.floor(enemy.y) - Math.floor(player.getY())) < enemyRange) return enemy.y += enemy.speed
  //     if((Math.floor(enemy.y) + Math.floor(player.getY())) > enemyRange) return enemy.y -= enemy.speed
  //   }
  // }
  //
  // function incrPos(enemy,direction){
  //   return enemy.direction += enemy.speed
  // }
  //
  // function decrPos(enemy,direction){
  //   return enemy.direction += enemy.speed
  // }


  function decideToMove(enemy, enemyRange){
    for(let i = 0; i < players.length; i++){

      if(
        Math.floor(enemy.x) - Math.floor(players[i].getX()) < enemyRange ||
        Math.floor(enemy.y) - Math.floor(players[i].getY()) < enemyRange
        ){
          //console.log('true')
         return i
       }
        return -1
    }
  }


  function onShoot(data){
    console.log(data.id, ' is shooting!')
    const bullet = new Bullet(Object.keys(bullets).length, data.id, data.x, data.y, data.v, data.r);
    bullets.push(bullet);

    // this.volatile.broadcast.emit('shoot', bullet);
    // this.volatile.emit('shoot', bullet);
    this.broadcast.emit('shoot', bullet);
    this.emit('shoot', bullet);
  }

  function onEnemyHit(data){
    const hitEnemy = enemyById(data.id)

    if (!hitEnemy) {
        console.log("Enemy (move) not found: " + data.id)
        return
    }

    console.log('ENEMY HIT!!!!!!',hitEnemy.health, data.damage)

    hitEnemy.health -= data.damage

    if(hitEnemy.health <= 0){
      io.sockets.emit('enemyHit', {id: hitEnemy.id, health: 0, alive: false})
      return enemies.splice(enemies.indexOf(hitEnemy),1)
    }
    return io.sockets.emit('enemyHit', {id: hitEnemy.id, health: hitEnemy.health, alive: true})
  }


  function onSocketDisconnect() {
    console.log("Player has disconnected: " + this.id)

    const removePlayer = playerById(this.id)
    if (!removePlayer) {
        console.log("Player not found: " + this.id)
        return
    }

    this.broadcast.emit('removePlayer', {id: removePlayer.id})
    players.splice(players.indexOf(removePlayer), 1)
    // io.sockets.emit('removePlayer', {id: this.id})
    // io.emit('removePlayer', "A user disconnected");
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
  			//console.log("x:"+x+",y:"+y);
  			if (x < -1000 || x > 1000 || y < -1000 || y > 1000){
  				//console.log("x:"+x+",y:"+y+",bullet.r:"+bullet.r+",bullet.v:"+bullet.v);
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
  				//console.log("Enemy HIT!!!!!!!");
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
  //console.log("p.x:"+p.x+",p.y:"+p.y);
  //console.log("x1:"+r.x1+",y1:"+r.y1+",x2:"+r.x2+",y2:"+r.y2);
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
