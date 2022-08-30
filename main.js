import { 
  init,
  GameLoop,
  initKeys,
  Sprite,
  keyPressed,
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
  canvas.height = 680

  let player;

  const PATTERN_R = canvas.width * 0.4
  const LOCATION_R = canvas.width * 0.02
  const NUM_OF_LOC = 8
  const CANVAS_CENTER = {
    x: canvas.width / 2,
    y: canvas.height / 2
  }
  const START_PT = 2

  let location_coords = []

  let isPlaying   
  let entities

  ///////////////////////////////////////////////////////////////////////////////

  function determineLocationCoords() {
    for (let i = 0; i < NUM_OF_LOC; i++) {
      let angle = i * (360 / 8) / 180 * Math.PI
      let coords = {
        x: CANVAS_CENTER.x + Math.cos(angle) * PATTERN_R,
        y: CANVAS_CENTER.y + Math.sin(angle) * PATTERN_R
      }
      location_coords.push(coords)
    }
  }

  /*
    This is to draw circles so that the player would know what is their next location.
  */
  function drawLocations() {
    for (let i = 0; i < location_coords.length; i++) {
      let location = Sprite({
        x: location_coords[i].x,
        y: location_coords[i].y,
        color: 'white',
        render: function() {
          context.fillStyle = this.color;
          context.beginPath();
          context.arc(0, 0, LOCATION_R, 0, 2  * Math.PI);
          context.fill();
        }
      })
      location.render()
    }

  }

  function setPlayerInitLoc(target_x, target_y) {
    player = new Player({
      x: target_x,
      y: target_y
    })
  }

  function handlePlayerInput() {
    let keyboardDirection = keyPressed('arrowright') - keyPressed('arrowleft');
    if (keyboardDirection) {
      this.x += 10 * keyboardDirection
    }
  }
  
  // initInput();

  // init high score
  // localStorage[highScoreKey] = localStorage[highScoreKey] || 0;

  ///////////////////////////////////////////////////////////////////////////////

  function startGame() {
    determineLocationCoords()
    setPlayerInitLoc(location_coords[2].x, location_coords[2].y)
  }

  startGame()

  ///////////////////////////////////////////////////////////////////////////////

  function gameUpdate() {
    player.update()
  }

  function gameRender() {
    player.render()
    drawLocations()
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