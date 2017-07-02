const Enemy = function(game,gameWidth,gameHeight){
  game.add.sprite(genRandomNum(gameWidth),genRandomNum(gameHeight),'zombie')
}


Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.move = function(){

}

function genRandomNum(factor){
  return Math.floor(factor * Math.random())
}
