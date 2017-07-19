const bullets = require('./index').bullets
const enemies = require('./index').enemies

const checkCollisions = setInterval (function () {
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
        // gSocket.volatile.broadcast.emit('shot',packet);
        // gSocket.volatile.emit('shot',packet);
        client.event.emit('shot',packet);
        client.event.emit('shot',packet);
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
  //console.log("p.x:"+p.x+",p.y:"+p.y);
  //console.log("x1:"+r.x1+",y1:"+r.y1+",x2:"+r.x2+",y2:"+r.y2);
  return p.x >= r.x1 && p.x <= r.x2 && p.y >= r.y1 && p.y <= r.y2;
}
