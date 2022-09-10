import { 
  init,
  GameLoop,
  initKeys,
  Sprite,
  randInt,
  Text,
  getCanvas
} from 'kontra';
import { Coin } from './coin';
import { Enemy } from './enemy';
import { menuState } from './game_states/menuState';
import { createGameStateMachine, gameStateMachine } from './game_state_machine';
import { Player } from './player';
import { circleCirCollision } from './utils';
import { COMPASS_DIR } from './compassDir';
import { levelState } from './game_states/levelState';

type CoordType = {
  x: number,
  y: number
}

// const { canvas, context } = init();


const NUM_OF_LOC = 8
const OBJ_SPAWN_R = 30

const COIN_SCORE = 50
const KEY_DOWN = 'keydown'
const ARROW_LEFT = "ArrowLeft"
const ARROW_RIGHT = "ArrowRight"


function main() {

  // globals
  // let location, score, lives

  initKeys()

  let { canvas, context } = init();

  canvas.width = 640
  canvas.height = 640

  // const CANVAS_CENTER = {
  //   x: canvas.width / 2,
  //   y: canvas.height / 2
  // }

  // const PATTERN_R = canvas.width * 0.4
  // const LOCATION_R = canvas.width * 0.02

  // let timestamp = 0

  // let player: Player;

  

  // let location_coords: CoordType[] = []

  // let isPlaying = true
  
  // let score = 0

  // let scoreText = Text({
  //   text: `${score}`,
  //   font: '77px Arial',
  //   color: 'white',
  //   x: 100,
  //   y: 50,
  //   anchor: {x: 0.5, y: 0.5}
  // });
  
  // let entities: Sprite[] = []

  ///////////////////////////////////////////////////////////////////////////////

  // function determineLocationCoords() {
  //   for (let i = 0; i < NUM_OF_LOC; i++) {
  //     let angle = i * (360 / 8) / 180 * Math.PI
  //     let coords = {
  //       x: CANVAS_CENTER.x + Math.cos(angle) * PATTERN_R,
  //       y: CANVAS_CENTER.y + Math.sin(angle) * PATTERN_R
  //     }
  //     location_coords.push(coords)
  //   }
  // }

  // function createEnemy(posx: number, posy: number, dir: number) {
  //   let enemy = new Enemy({
  //     x: posx,
  //     y: posy,
  //     direction: dir
  //   })
  //   entities.push(enemy)
  // }

  // function createCoin(posx: number, posy: number, dir: number) {
  //   let coin = new Coin({
  //     x: posx,
  //     y: posy,
  //     direction: dir
  //   })
  //   entities.push(coin)
  // }

  /*
    This is to draw circles so that the player would know what is their next location.
  */
  // function drawLocations(context: CanvasRenderingContext2D) {
  //   for (let i = 0; i < location_coords.length; i++) {
  //     let location = Sprite({
  //       x: location_coords[i].x,
  //       y: location_coords[i].y,
  //       color: 'white',
  //       render: function() {
  //         context.fillStyle = this.color ? this.color : "";
  //         context.beginPath();
  //         context.arc(0, 0, LOCATION_R, 0, 2  * Math.PI);
  //         context.fill();
  //       }
  //     })
  //     location.render()
  //   }

  // }

  // function createPlayer(loc_num: number) {
  //   player = new Player({
  //     x: location_coords[loc_num].x,
  //     y: location_coords[loc_num].y,
  //     loc_index: loc_num,
  //     direction: loc_num
  //   })
  //   entities.push(player)
  // }

  // function setPlayerLocation(loc_num: number) {
  //   player.x = location_coords[loc_num].x
  //   player.y = location_coords[loc_num].y
  //   player.direction = loc_num
  // }

  // function movePlayerInClock(isClock: boolean)
  // {
  //   const limit = location_coords.length - 1
  //   if(isClock)
  //   {
  //     player.loc_index = player.loc_index + 1 > limit ? 0 : player.loc_index + 1
  //   }
  //   else
  //   {
  //     player.loc_index = player.loc_index - 1 < 0 ? limit : player.loc_index - 1
  //   }

  //   setPlayerLocation(player.loc_index)
  // }

  // function initPlayerInput() {
  //   window.addEventListener(KEY_DOWN, (event) => {
  //     if(event.key === ARROW_LEFT)
  //     {
  //       movePlayerInClock(true)
  //     }
  //     else if(event.key === ARROW_RIGHT)
  //     {
  //       movePlayerInClock(false)
  //     }
  //   })
  // }

  ///////////////////////////////////////////////////////////////////////////////

  // function startGame() {
  //   determineLocationCoords()
  //   createPlayer(COMPASS_DIR.SOUTH)
    // initPlayerInput()
  // }

  // startGame()

  createGameStateMachine(menuState)
  // testMethod()

  ///////////////////////////////////////////////////////////////////////////////

  function testMethod() {
    gameStateMachine.setState(levelState)
  }

  function gameUpdate() {
    gameStateMachine.getState().onUpdate()
  }

  function gameRender() {
    gameStateMachine.getState().onRender()
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