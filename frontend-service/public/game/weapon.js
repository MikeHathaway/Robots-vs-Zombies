//tutorial this is based upon
  //https://github.com/photonstorm/phaser-coding-tips/blob/master/issue-007/bulletpool.html

const Weapon = {}

/* ----- Single Bullet ----- */
Weapon.SingleBullet = function (game) {
    Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);
    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;
    for (var i = 0; i < 64; i++){
      this.add(new Bullet(game, 'bullet'), true);
    }
    return this;
};

Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);

Weapon.SingleBullet.prototype.constructor = Weapon.SingleBullet;

Weapon.SingleBullet.prototype.fire = function (source) {
    if (this.game.time.time < this.nextFire) { return; }
    let x = source.x + 10;
    let y = source.y + 10;
    this.getFirstExists(false).fire(x, y, source.x, this.bulletSpeed, 0, 0);
    this.nextFire = this.game.time.time + this.fireRate;
};


/* ----- Lazer Fire ----- */
Weapon.Beam = function (game) {
      Phaser.Group.call(this, game, game.world, 'Beam', false, true, Phaser.Physics.ARCADE);
      this.nextFire = 0;
      this.bulletSpeed = 1000;
      this.fireRate = 45;
      for (var i = 0; i < 64; i++)
      {
          this.add(new Bullet(game, 'lazer'), true);
      }
      return this;
  };

  Weapon.Beam.prototype = Object.create(Phaser.Group.prototype);

  Weapon.Beam.prototype.constructor = Weapon.Beam;

  Weapon.Beam.prototype.fire = function (source) {
      if (this.game.time.time < this.nextFire) { return; }
      var x = source.x + 40;
      var y = source.y + 10;
      this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
      this.nextFire = this.game.time.time + this.fireRate;
  };
