import CivZombie from '../main'

const Boot = function () {};

Boot.prototype = {

  preload: function () {
    CivZombie.game.load.image('space', 'assets/space.png')
  },

  create: function () {
    CivZombie.game.state.start('MainMenu')
  }

}

export default Boot
