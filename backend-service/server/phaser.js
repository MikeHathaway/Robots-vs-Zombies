// Found at: https://github.com/crisu83/capthatflag/blob/feature/phaser-server/server/app/phaser.js

const Canvas = require('canvas')
const jsdom = require('jsdom')
const document = jsdom.jsdom(null)
const window = document.parentWindow
let Phaser

// expose a few things to all the modules
global.document = document
global.window = window
global.Canvas = Canvas
global.Image = Canvas.Image
global.window.CanvasRenderingContext2D = 'foo' // let Phaser know that we have a canvas
global.window.Element = undefined
global.navigator = {userAgent: 'Custom'} // could be anything

// fake the xml http request object because Phaser.Loader uses it
global.XMLHttpRequest = function() {}

// load an expose PIXI in order to finally load Phaser
global.PIXI = require('Phaser/build/custom/pixi')
global.Phaser = Phaser = require('Phaser/build/custom/phaser-arcade-physics')

module.exports = Phaser
