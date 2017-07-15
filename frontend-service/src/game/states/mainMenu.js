import game from '../game'

export function mainMenu(){
  game.background = game.add.tileSprite(0, 0, game.width, game.height, 'space');

  //give it speed in x
  game.background.autoScroll(-20, 0);

  //start game text
  let text = "Tap to begin";
  let style = { font: "30px Arial", fill: "#fff", align: "center" };
  const t = game.add.text(game.width/2, game.height/2, text, style);
  t.anchor.set(0.5);

  //highest score
  text = "Highest score: "+game.score;
  style = { font: "15px Arial", fill: "#fff", align: "center" };

  const h = game.add.text(game.width/2, game.height/2 + 50, text, style);
  h.anchor.set(0.5);
}

export function waitForInput() {
    if(game.input.activePointer.justPressed()) {
      game.state.start('Game');
    }
  }
