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

    // title text
    let text = "Robots VS Zombies"
    let style = { font: "80px Orbitron", fill: "#FF0000", align: "center" } //#fff Arial
    const title = this.game.add.text(this.game.width/2, this.game.height - 650, text, style)
    title.anchor.set(0.5)

    //start game text
    text = "Click here to begin"
    style = { font: "30px Arial", fill: "#fff", align: "center" }
    const t = this.game.add.text(this.game.width/2, this.game.height/2, text, style)
    t.anchor.set(0.5)

    //highest score
    //text = "Highest score: " + this.game.score
    text = 'Use WASD to Move, Mouse to Aim, Click or Space to Fire, \n Enter to change weapon'
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

//https://phaser.io/docs/2.6.2/Phaser.Button.html
  // new Button(game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame)
  // button = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);

  /*
    button = game.add.button(game.world.centerX, game.world.centerY - 100, 'button', startGame)
    button.anchor.set(0.5,0.5)
  */



export default GameMenu
