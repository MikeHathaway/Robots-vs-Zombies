const Enemy = function(id,x,y,speed,scoreValue,type,health){
  this.id = id
  this.x = x
  this.y = y
  this.speed = speed || 2
  this.scoreValue = scoreValue || 2
  this.type = type
  this.health = health || 30
}

exports.Enemy = Enemy
