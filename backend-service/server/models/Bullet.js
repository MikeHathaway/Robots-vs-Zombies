const Bullet = function (id,pid,x,y,v,r,type){
	this.dt = Date.now()
	this.id = id
	this.pid = pid
	this.x = x // x position
	this.y = y // y position
	this.v = v // velocity
	this.r = r // rotation
	this.type = type || 'bullet'
	return this
}

exports.Bullet = Bullet
