/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 365);
/******/ })
/************************************************************************/
/******/ ({

/***/ 147:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bullet = function (_Phaser$Sprite) {
  _inherits(Bullet, _Phaser$Sprite);

  function Bullet(game, type) {
    _classCallCheck(this, Bullet);

    var _this //defaults to arcade

    = _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).call(this, game, 0, 0, type));

    _this.game = game;
    _this.type = type;

    game.physics.enable(_this);_this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    _this.anchor.set(0.5);

    _this.checkWorldBounds = true;
    _this.outOfBoundsKill = true;
    _this.exists = false;

    _this.tracking = false;
    _this.scaleSpeed = 0;
    return _this;
  }

  _createClass(Bullet, [{
    key: "fire",
    value: function fire(x, y, angle, speed, gx, gy) {
      gx = gx || 0;
      gy = gy || 0;
      this.reset(x, y);
      this.scale.set(1);
      this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
      this.angle = angle;
      this.body.gravity.set(gx, gy);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.tracking) {
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
      }
      if (this.scaleSpeed > 0) {
        this.scale.x += this.scaleSpeed;
        this.scale.y += this.scaleSpeed;
      }
    }
  }]);

  return Bullet;
}(Phaser.Sprite);

exports.default = Bullet;

/***/ }),

/***/ 359:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//http://metroid.niklasberg.se/2016/02/12/phaser-making-and-using-a-generic-enemy-class-es6es2015/

//https://phaser.io/examples/v2/games/tanks

//http://www.html5gamedevs.com/topic/14281-help-needed-for-better-enemy-ai/
//^add functionality for more sophisticated enemy ai


var Enemy = function (_Phaser$Sprite) {
  _inherits(Enemy, _Phaser$Sprite);

  function Enemy(game, x, y, type) {
    _classCallCheck(this, Enemy);

    var _this = _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, game, 0, 0, 'zombie'));

    _this.x = genRandomNum(x);
    _this.y = genRandomNum(y);
    _this.speed = 2;
    _this.type = type;
    _this.health = 30;
    game.physics.enable(_this);
    return _this;
  }

  _createClass(Enemy, [{
    key: 'spawnEnemy',
    value: function spawnEnemy(game, x, y) {
      game.add.sprite(genRandomNum(x), genRandomNum(y), 'zombie');
    }
  }, {
    key: 'move',
    value: function move() {
      this.x += genMovement(this.speed);
      this.y += genMovement(this.speed);
    }
  }, {
    key: 'isAlive',
    value: function isAlive() {
      if (this.health <= 0) this.kill();
    }
  }, {
    key: 'takeDamage',
    value: function takeDamage(damage) {
      this.health -= damage;
    }
  }, {
    key: 'update',
    value: function update() {
      this.game.physics.arcade.collide(this, this.game.collisionLayer);

      // if (this.body.blocked.right) {
      //   this.scale.x = -1;
      //   this.body.x = genRandomNum(this.speed)
      // } else if (this.body.blocked.left) {
      //   this.scale.x = 1;
      //   this.body.velocity.x = genRandomNum(this.speed)
      // }
    }
  }]);

  return Enemy;
}(Phaser.Sprite);

function genRandomNum(factor) {
  return Math.floor(factor * Math.random());
}

function genMovement(factor) {
  return Math.floor(factor * (Math.round(Math.random()) * 2 - 1));
}

exports.default = Enemy;

/***/ }),

/***/ 360:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LazerBeam = exports.SingleBullet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bullet = __webpack_require__(147);

var _bullet2 = _interopRequireDefault(_bullet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //tutorial this is based upon
//https://github.com/photonstorm/phaser-coding-tips/blob/master/issue-007/bulletpool.html

//http://phaser.io/docs/2.4.4/Phaser.Group.html

var Weapon = function (_Phaser$Group) {
  _inherits(Weapon, _Phaser$Group);

  function Weapon(game) {
    _classCallCheck(this, Weapon);

    var _this = _possibleConstructorReturn(this, (Weapon.__proto__ || Object.getPrototypeOf(Weapon)).call(this, game));

    _this.game = game;
    return _this;
  }

  _createClass(Weapon, [{
    key: 'fire',
    value: function fire(source) {
      if (this.game.time.time < this.nextFire) {
        return;
      }
      var x = source.x + 10;
      var y = source.y + 10;
      this.getFirstExists(false).fire(x, y, source.x, this.bulletSpeed, 0, 0);
      this.nextFire = this.game.time.time + this.fireRate;
    }
  }, {
    key: 'addBullets',
    value: function addBullets(weapon, game, type, instances) {
      var count = 0;
      while (count++ < instances) {
        weapon.add(new _bullet2.default(game, type), true);
      }
    }
  }]);

  return Weapon;
}(Phaser.Group);

/* ----- Single Bullet ----- */


var SingleBullet = exports.SingleBullet = function (_Weapon) {
  _inherits(SingleBullet, _Weapon);

  function SingleBullet(game, type) {
    _classCallCheck(this, SingleBullet);

    var _this2 = _possibleConstructorReturn(this, (SingleBullet.__proto__ || Object.getPrototypeOf(SingleBullet)).call(this, game));

    _this2.nextFire = 0;
    _this2.bulletSpeed = 600;
    _this2.fireRate = 100;
    _this2.damage = 5;
    _this2.addBullets(_this2, game, type, 64);
    return _this2;
  }

  return SingleBullet;
}(Weapon);

/* ----- Lazer Weapon ----- */


var LazerBeam = exports.LazerBeam = function (_Weapon2) {
  _inherits(LazerBeam, _Weapon2);

  function LazerBeam(game, type) {
    _classCallCheck(this, LazerBeam);

    var _this3 = _possibleConstructorReturn(this, (LazerBeam.__proto__ || Object.getPrototypeOf(LazerBeam)).call(this, game));

    _this3.nextFire = 0;
    _this3.bulletSpeed = 600;
    _this3.fireRate = 100;
    _this3.damage = 5;
    _this3.addBullets(_this3, game, type, 64);
    return _this3;
  }

  return LazerBeam;
}(Weapon);

/***/ }),

/***/ 365:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _bullet = __webpack_require__(147);

var _bullet2 = _interopRequireDefault(_bullet);

var _weapon = __webpack_require__(360);

var _enemy = __webpack_require__(359);

var _enemy2 = _interopRequireDefault(_enemy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function startGame() {

  /* ----- Declares global variables ----- */
  var map = void 0;
  var layer = void 0;
  var player = void 0;
  var cursors = void 0;
  var firebutton = void 0;
  var changeKey = void 0;
  var collisionLayer = void 0;
  var enemies = void 0;
  var bullets = void 0;

  var weapons = void 0;

  var gameWidth = 1000;
  var gameHeight = 800;
  // const weapons = []
  var players = [];

  var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game-container', {
    preload: preload,
    create: create,
    update: update,
    render: render
  });

  function preload() {
    game.load.crossOrigin = 'anonymous';

    game.load.tilemap('desert', './game/assets/tilemaps/desert.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('forest', './game/assets/tilemaps/forest.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('forestTiles', './game/assets/tilemaps/trees-and-bushes.png');
    game.load.image('tiles', './game/assets/tilemaps/tmw_desert_spacing.png');

    game.load.image('zombie', './game/assets/Zombie_Sprite.png');
    game.load.image('human', './game/assets/dude.png');
    game.load.image('bullet', './game/assets/singleBullet.png');
    game.load.image('lazer', './game/assets/lazer.png');
    game.load.spritesheet('zombies', './game/assets/zombie_sheet.png', 32, 48);
  }

  function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    addMap();
    addEnemies();
    addPlayer();

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    changeKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  }

  function hitEnemy(bullet, enemy) {
    enemy.takeDamage(bullet.parent.damage);
    bullet.kill();
    console.log("Hit");
  }

  function update() {

    game.physics.arcade.collide(player, collisionLayer);
    game.physics.arcade.collide(enemies, collisionLayer

    /* Collide weaponry with enemies */
    );game.physics.arcade.overlap(player.weapons, enemies, hitEnemy, null, this

    // controller for enemy actions each game loop
    );enemies.children.forEach(function (enemy) {
      enemy.isAlive();
      enemy.move();
    });

    if (cursors.left.isDown) {
      player.body.x -= player.body.velocity.x;
    }
    if (cursors.right.isDown) {
      player.body.x += player.body.velocity.x;
    }

    if (cursors.up.isDown) {
      player.body.y -= player.body.velocity.y;
    }

    if (cursors.down.isDown) {
      player.body.y += player.body.velocity.y;
    }

    if (fireButton.isDown) {
      player.weapons.children[player.currentWeapon].fire(player);
    }

    if (changeKey.isDown) {
      changeWeapon(player);
    }
  }

  function render() {
    game.debug.spriteInfo(player, 32, 450);
  }

  /* ----- HELPER FUNCTIONS ----- */
  function changeWeapon(player) {
    if (player.currentWeapon === 1) {
      player.currentWeapon = 0;
      return this;
    }

    if (player.currentWeapon === 0) {
      player.currentWeapon = 1;
      return this;
    }
  }

  function addMap() {

    /* old desert map */
    map = game.add.tilemap('desert');
    map.addTilesetImage('Desert', 'tiles');
    layer = map.createLayer('Ground'

    /* new forest test map */
    // map = game.add.tilemap('forest')
    // map.addTilesetImage('forestTiles', 'forestTiles')
    // map.addTilesetImage('tmw_desert_spacing', 'tiles')
    // layer = map.createLayer('MapLayer')
    // collisionLayer = map.createLayer('CollisionLayer')
    // collisionLayer.visible = false
    // map.setCollisionByExclusion([], true, collisionLayer)

    );layer.resizeWorld();
  }

  function addEnemies() {
    enemies = game.add.group

    /* ----- Generate Zombies FRP ----- */
    ();function addZombie() {
      var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;

      var i = 0;
      while (i++ < number) {
        enemies.add(new _enemy2.default(game, gameWidth, gameHeight, 'zombie'));
      }
    }

    addZombie

    // function handleError(err){
    //   return console.error(err)
    // }
    //
    // const source = Rx.Observable.interval(1000 /* ms */).timeInterval().take(5)
    // const subscription = source.subscribe(addZombie,handleError)
    ();
  }

  function addPlayer() {
    player = game.add.sprite(32, game.world.height / 2, 'zombie');

    weapons = game.add.group();
    weapons.add(new _weapon.SingleBullet(game, 'bullet'));
    weapons.add(new _weapon.LazerBeam(game, 'lazer'));
    player.weapons = weapons;
    player.currentWeapon = 0;

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    player.body.velocity.x = 10;
    player.body.velocity.y = 10;

    game.camera.follow(player);
  }
})(); //https://www.joshmorony.com/create-a-running-platformer-game-in-phaser-with-tilemaps/
//use tiled to generate tile maps for the gameplay
//https://opengameart.org/content/trees-bushes
//^source of free png for generating tilemaps

//Use for strategic view and or capital tactical traversal
//https://opengameart.org/content/colony-sim-assets

//http://www.dynetisgames.com/2017/03/06/how-to-make-a-multiplayer-online-game-with-phaser-socket-io-and-node-js/
// ^making game multiplayer

/***/ })

/******/ });