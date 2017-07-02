// const Enemy = function(game,gameWidth,gameHeight){
//   game.add.sprite(genRandomNum(gameWidth),genRandomNum(gameHeight),'zombie')
// }

const Enemy = {}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

Enemy.prototype.addEnemy = function(game,gameWidth,gameHeight){
  game.add.sprite(genRandomNum(gameWidth),genRandomNum(gameHeight),'zombie')
}

Enemy.prototype.constructor = Enemy;

Enemy.prototype.move = function(){}

Enemy.prototype.hitEnemy = function(player, enemy){
  enemy.kill();
  console.log("Hit");
}


function genRandomNum(factor){
  return Math.floor(factor * Math.random())
}
