import CivZombie from '../main'

const GameOver = function () {};

GameOver.prototype = {

  create: function () {
    this.game.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space')

    //give it speed in x
    this.game.background.autoScroll(-20, 0)

    //start game text
    let text = `GAME OVER`
    let style = { font: "90px Orbitron", fill: "#FF0000", align: "center" }
    const t = this.game.add.text(this.game.width/2, this.game.height - 650, text, style)
    t.anchor.set(0.5)

    text = `Score: ${window._score || 0} \nLevel: ${window._level || 1} `
    style = { font: "45px Orbitron", fill: "#fff", align: "center" }

    const h = this.game.add.text(this.game.width/2, this.game.height/2 + 100, text, style)
    h.anchor.set(0.5)

    t.inputEnabled = true
    t.events.onInputDown.addOnce(this.startOver, this)
  },

  startOver: function () {
    CivZombie.game.state.start('Game') //'mainMenu'
    //currently blocked by the duplicate player check
  }

}

export default GameOver
