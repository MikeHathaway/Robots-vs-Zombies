class Bullet extends Phaser.Sprite{
  constructor(game,type,tracking,id){
    super(game,0,0,type)
    this.game = game
    this.type = type
    this.id = id

    //prevent tracking on lazers
    if(this.type === 'lazer'){
      tracking = false
    }

    game.physics.enable(this) //defaults to arcade

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST

    this.anchor.set(0.5)

    this.checkWorldBounds = true
    this.outOfBoundsKill = true
    this.exists = false

    this.tracking = tracking || false
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
  
}

export default Bullet
