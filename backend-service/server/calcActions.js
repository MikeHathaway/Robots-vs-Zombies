//inspired by: https://github.com/Langerz82/phasertanksmultiplayer/blob/master/server.js

setInterval (function () {
    // For each Players go through the bullets if any contact report.
	const players = getAllPlayers();
	for (var i=0; i < bullets.length; ++i){
		const bullet = bullets[i];
		if (!bullet) continue;
		for (var id2 in players) {
			const player = players[id2];
			if (!player || player.id == bullet.pid) continue;
			elapsedTime = (Date.now() - bullet.dt) / 1000;
			//console.log("elapsedTime: " + elapsedTime);

			//console.log("radians:"+bullet.r/Math.PI);
			const theta = bullet.r
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
