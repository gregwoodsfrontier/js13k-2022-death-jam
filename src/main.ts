import { 
  init,
  GameLoop,
  initKeys,
  Sprite,
  keyPressed,
  clamp
} from 'kontra';
import { Enemy } from './enemy';
import { Player } from './player';

type CoordType = {
  x: number,
  y: number
}

enum COMPASS_DIR {
  EAST,
  SOUTH_EAST,
  SOUTH
}

const KEY_UP = 'keyup'
const KEY_DOWN = 'keydown'
const ARROW_LEFT = "ArrowLeft"
const ARROW_RIGHT = "ArrowRight"

function main() {

  // globals
  // let location, score, lives

  initKeys()

  let { canvas, context } = init();
  canvas.width = 680
  canvas.height = 680

  let player: Player;

  const PATTERN_R = canvas.width * 0.4
  const LOCATION_R = canvas.width * 0.02
  const NUM_OF_LOC = 8
  const CANVAS_CENTER = {
    x: canvas.width / 2,
    y: canvas.height / 2
  }

  let enemy_1: Enemy


  let location_coords: CoordType[] = []

  // let isPlaying   
  // let entities

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
  function drawLocations(context: CanvasRenderingContext2D) {
    for (let i = 0; i < location_coords.length; i++) {
      let location = Sprite({
        x: location_coords[i].x,
        y: location_coords[i].y,
        color: 'white',
        render: function() {
          context.fillStyle = this.color ? this.color : "";
          context.beginPath();
          context.arc(0, 0, LOCATION_R, 0, 2  * Math.PI);
          context.fill();
        }
      })
      location.render()
    }

  }

  function setPlayerInitLoc(loc_num: number) {
    player = new Player({
      x: location_coords[loc_num].x,
      y: location_coords[loc_num].y,
      loc_index: loc_num
    })
  }

  function setPlayerLocation(loc_num: number) {
    player.x = location_coords[loc_num].x
    player.y = location_coords[loc_num].y
  }

  function movePlayerInClock(isClock: boolean)
  {
    const limit = location_coords.length - 1
    if(isClock)
    {
      player.loc_index = player.loc_index + 1 > limit ? 0 : player.loc_index + 1
    }
    else
    {
      player.loc_index = player.loc_index - 1 < 0 ? limit : player.loc_index - 1
    }

    setPlayerLocation(player.loc_index)
  }

  function initPlayerInput() {
    window.addEventListener(KEY_DOWN, (event) => {
      if(event.key === ARROW_LEFT)
      {
        movePlayerInClock(true)
      }
      else if(event.key === ARROW_RIGHT)
      {
        movePlayerInClock(false)
      }
      
    })
  }
  
  // initInput();

  // init high score
  // localStorage[highScoreKey] = localStorage[highScoreKey] || 0;

  ///////////////////////////////////////////////////////////////////////////////

  function startGame() {
    determineLocationCoords()
    setPlayerInitLoc(COMPASS_DIR.SOUTH)
    initPlayerInput()

    enemy_1 = new Enemy({
      x: CANVAS_CENTER.x + 20,
      y: CANVAS_CENTER.y
    })
  }

  startGame()

  ///////////////////////////////////////////////////////////////////////////////

  function gameUpdate() {
    // player.update()
    enemy_1.update()
  }

  function gameRender() {
    player.render()
    enemy_1.render()
    drawLocations(context)
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