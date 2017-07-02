function* genZombie(game,gameWidth,gameHeight){
  while(true){
    yield game.add.sprite(genRandomNum(gameWidth),genRandomNum(gameHeight),zombie)
  }
}





const Enemy = function(game,gameWidth,gameHeight){
  // Rx.Observable.from(genZombie()).interval(1000)
  // setInterval(genZombie(game,gameWidth,gameHeight).next(),1000)

  const source = Rx.Observable.interval(1000 /* ms */)
  const subscription = source.subscribe(game.add.sprite(genRandomNum(gameWidth),genRandomNum(gameHeight),'zombie'),handleError)
}


Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.move = function(){

}

function handleError(err){
  return console.error(err)
}

function genRandomNum(factor){
  return Math.floor(factor * Math.random())
}
