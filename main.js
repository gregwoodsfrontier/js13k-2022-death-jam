import { 
  init,
  GameLoop,
  initKeys,
  getCanvas,
  initInput
} from 'kontra';
import { Player } from './player';

function main() {

  // globals
  let location, score, lives

  initKeys()

  let { canvas, context } = init();
  canvas.width = 680
  canvas.height = 340

  let player = new Player({
    x: canvas.width / 2,
    y: canvas.height / 2
  })

  let isPlaying   
  let entities

  ///////////////////////////////////////////////////////////////////////////////

  
  // initInput();

  // init high score
  // localStorage[highScoreKey] = localStorage[highScoreKey] || 0;

  ///////////////////////////////////////////////////////////////////////////////

  function startGame() {

  }

  /*
    This is to draw circles so that the player would know what is their next location.
  */
  function drawLocations() {
    let center = {
      x: canvas.width / 2,
      y: canvas.height / 2
    }
  }

  ///////////////////////////////////////////////////////////////////////////////

  function gameUpdate() {
    player.update()
  }

  function gameRender() {
    player.render()
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Startup GameLoop
  const loop = GameLoop({
    update: gameUpdate,
    render: gameRender
  })

  loop.start()

}

main()