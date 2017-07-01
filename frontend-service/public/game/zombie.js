const Enemy = function(game,x,y){
  const zombie = game.add.sprite(x,y,'zombie')

}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.move = function(){

}
