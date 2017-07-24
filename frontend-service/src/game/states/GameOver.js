import CivZombie from '../main'

//const score = CivZombie.global.score
const score = 0

const GameOver = function () {};

GameOver.prototype = {

  create: function () {
    this.game.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space')

    //give it speed in x
    this.game.background.autoScroll(-20, 0)

    //start game text
    let text = `GAME OVER \n You scored: ${score}`
    let style = { font: "30px Arial", fill: "#fff", align: "center" }
    const t = this.game.add.text(this.game.width/2, this.game.height/2, text, style)
    t.anchor.set(0.5)

    text = 'Restart'
    style = { font: "15px Arial", fill: "#fff", align: "center" }

    const h = this.game.add.text(this.game.width/2, this.game.height/2 + 50, text, style)
    h.anchor.set(0.5)

    h.inputEnabled = true
    h.events.onInputDown.addOnce(this.startOver, this)
  },

  startOver: function () {
    CivZombie.game.state.start('Game') //'mainMenu'
    //currently blocked by the duplicate player check
  }

}

export default GameOver
