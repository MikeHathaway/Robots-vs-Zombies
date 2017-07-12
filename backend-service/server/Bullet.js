const Bullet = function (id,pid,x,y,v,r,tr){
	this.dt = Date.now()
	this.id = id
	this.pid = pid
	this.x = x
	this.y = y
	this.v = v
	this.r = r
	this.tr = tr
	return this
}

exports.Bullet = Bullet
