class Bullet extends Phaser.Sprite{
  constructor(game,type){
    super(game,0,0,type)
    this.game = game
    this.type = type

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST

    this.anchor.set(0.5)

    this.checkWorldBounds = true
    this.outOfBoundsKill = true
    this.exists = false

    this.tracking = false
    this.scaleSpeed = 0
  }

  fire(x, y, angle, speed, gx, gy){
    gx = gx || 0
    gy = gy || 0
    this.reset(x, y)
    this.scale.set(1)
    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity)
    this.angle = angle
    this.body.gravity.set(gx, gy)
  }

  update(){
    if (this.tracking){
      this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x)
    }
    if (this.scaleSpeed > 0){
      this.scale.x += this.scaleSpeed
      this.scale.y += this.scaleSpeed
    }
  }
}
