class Enemy {
  constructor(id,x,y,speed,scoreValue,type,health){
    this.id = id
    this.x = x
    this.y = y
    this.speed = speed || 8
    this.scoreValue = scoreValue || 2
    this.type = type || 'zombie'
    this.health = health || 30
  }

  setX(newX) {
      this.x = newX
  }

  setY(newY) {
      this.y = newY
  }
}

exports.Enemy = Enemy
