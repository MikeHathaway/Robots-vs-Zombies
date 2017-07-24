import game from './states/game'
import mainMenu from './states/mainMenu'
import Boot from './states/boot'
import GameOver from './states/GameOver'

const CivZombie = {}

const gameWidth = window.innerWidth
const gameHeight = window.innerHeight

//originally 1000 by 800
CivZombie.game = new Phaser.Game(1200, 920, Phaser.AUTO, 'game-container')

CivZombie.global = {
  level : 0,
  score : 0
}

CivZombie.game.state.add('Boot', Boot)
CivZombie.game.state.add('MainMenu', mainMenu)
CivZombie.game.state.add('Game', game)
CivZombie.game.state.add('GameOver', GameOver)

CivZombie.game.state.start('Boot')

export default CivZombie
