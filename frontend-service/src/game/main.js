CivZombie.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

CivZombie.game.state.add('Boot', CivZombie.Boot);
CivZombie.game.state.add('Preload', CivZombie.Preload);
CivZombie.game.state.add('MainMenu', CivZombie.MainMenu);
CivZombie.game.state.add('Game', CivZombie.Game);

CivZombie.game.state.start('MainMenu');
