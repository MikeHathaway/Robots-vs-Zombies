//tutorial this is based upon
  //https://github.com/photonstorm/phaser-coding-tips/blob/master/issue-007/bulletpool.html

//boost performance by reducing the rate of fire?

import Bullet from './bullet'

class Weapon extends Phaser.Group {
  constructor(game){
    super(game)
    this.game = game
  }

  fire(source){
    if (this.game.time.time < this.nextFire) { return; }
    let x = source.x + 10;
    let y = source.y + 10;
    this.getFirstExists(false).fire(x, y, source.x, this.bulletSpeed, 0, 0);
    this.nextFire = this.game.time.time + this.fireRate;
  }

  addBullets(weapon,game,type,instances){
    let count = 0
    while(count++ < instances){
      weapon.add(new Bullet(game, type, true, count), true)
    }
  }
}


/* ----- Single Bullet ----- */
export class SingleBullet extends Weapon {
  constructor(game,type){
    super(game)
    this.nextFire = 0
    this.bulletSpeed = 600;
    this.fireRate = 80 //1000
    this.damage = 5
    this.addBullets(this,game,type,120)
  }
}

/* ----- Lazer Weapon ----- */
export class LazerBeam extends Weapon {
  constructor(game,type){
    super(game)
    this.nextFire = 0
    this.bulletSpeed = 600;
    this.fireRate = 50
    this.damage = 3
    this.addBullets(this,game,type,120)
  }
}


/* ----- Heart Weapon ----- */
export class HeartGun extends Weapon {
  constructor(game,type){
    super(game)
    this.nextFire = 0
    this.bulletSpeed = 600;
    this.fireRate = 50
    this.damage = 10
    this.addBullets(this,game,type,120)
  }
}
