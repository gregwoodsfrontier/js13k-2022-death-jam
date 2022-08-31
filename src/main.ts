import { 
  init,
  GameLoop,
  initKeys,
  Sprite,
  keyPressed,
  clamp
} from 'kontra';
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

  function handlePlayerInput() {
    let prev_loc = 0
    const limit = location_coords.length - 1

    if(player.loc_index)
    {
      prev_loc = player.loc_index
    }

    if(keyPressed("arrowleft"))
    {
      player.loc_index = player.loc_index + 1 > limit ? 0 : player.loc_index + 1
      setPlayerLocation(player.loc_index)
    }
    else if(keyPressed("arrowright"))
    {
      player.loc_index = player.loc_index - 1 < 0 ? limit : player.loc_index - 1
      setPlayerLocation(player.loc_index)
    }
  }
  
  // initInput();

  // init high score
  // localStorage[highScoreKey] = localStorage[highScoreKey] || 0;

  ///////////////////////////////////////////////////////////////////////////////

  function startGame() {
    determineLocationCoords()
    setPlayerInitLoc(COMPASS_DIR.SOUTH)
  }

  startGame()

  ///////////////////////////////////////////////////////////////////////////////

  function gameUpdate() {
    handlePlayerInput()
    // player.update()
  }

  function gameRender() {
    player.render()
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