const Bullet = function (id,pid,x,y,v,r){
	this.dt = Date.now()
	this.id = id
	this.pid = pid
	this.x = x
	this.y = y
	this.v = v
	this.r = r
	return this
}

exports.Bullet = Bullet
