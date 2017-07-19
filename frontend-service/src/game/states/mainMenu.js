import CivZombie from '../main'
import {socket} from '../eventHandlers'

const GameMenu = function() {}

GameMenu.prototype = {
  preload: function () {
    CivZombie.game.load.image('preloadbar', 'assets/preloader-bar.png')
  },

  create: function () {
    this.game.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space')

    //give it speed in x
    this.game.background.autoScroll(-20, 0)

    //start game text
    let text = "Tap to begin"
    let style = { font: "30px Arial", fill: "#fff", align: "center" }
    const t = this.game.add.text(this.game.width/2, this.game.height/2, text, style)
    t.anchor.set(0.5)

    //highest score
    //text = "Highest score: " + this.game.score
    text = 'Use Arrow Keys to Move, Press Space to Fire, \n Press Enter to change weapon'
    style = { font: "15px Arial", fill: "#fff", align: "center" }

    const h = this.game.add.text(this.game.width/2, this.game.height/2 + 50, text, style)
    h.anchor.set(0.5)

    t.inputEnabled = true
    t.events.onInputDown.addOnce(this.startGame, this)
  },

  startGame: function () {
    CivZombie.game.state.start('Game')
  }
}


export default GameMenu
