import { 
  init,
  GameLoop,
  initKeys,
  Sprite,
  randInt
} from 'kontra';
import { Enemy } from './enemy';
import { Player } from './player';
import { circleCirCollision } from './utils';

type CoordType = {
  x: number,
  y: number
}

enum COMPASS_DIR {
  EAST,
  SOUTH_EAST,
  SOUTH,
  SOUTH_WEST,
  WEST,
  NORTH_WEST,
  NORTH,
  NORTH_EAST
}

const KEY_DOWN = 'keydown'
const ARROW_LEFT = "ArrowLeft"
const ARROW_RIGHT = "ArrowRight"

let timestamp = 0

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
  const OBJ_SPAWN_R = 30
  const CANVAS_CENTER = {
    x: canvas.width / 2,
    y: canvas.height / 2
  }

  let location_coords: CoordType[] = []

  // let isPlaying   
  let entities: Sprite[] = []

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

  function createEnemy(posx: number, posy: number, dir: number) {
    let enemy = new Enemy({
      x: posx,
      y: posy,
      direction: dir
    })
    entities.push(enemy)
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

  function createPlayer(loc_num: number) {
    player = new Player({
      x: location_coords[loc_num].x,
      y: location_coords[loc_num].y,
      loc_index: loc_num,
      direction: COMPASS_DIR.SOUTH
    })
    entities.push(player)
  }

  function setPlayerLocation(loc_num: number) {
    player.x = location_coords[loc_num].x
    player.y = location_coords[loc_num].y
    player.direction = loc_num
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

  function enemySpawnLoop() {
    let delay = 500
    let t_now = new Date()
    if(t_now.getTime() > timestamp) {
      let spawn_loc = player.direction + randInt(-1, 1)
      let angle = spawn_loc * (360 / 8) / 180 * Math.PI
      createEnemy(
        CANVAS_CENTER.x + Math.cos(angle) * OBJ_SPAWN_R,
        CANVAS_CENTER.y + Math.sin(angle) * OBJ_SPAWN_R,
        spawn_loc
      )

      timestamp = Date.now() + delay
    }
  }

  ///////////////////////////////////////////////////////////////////////////////

  function startGame() {
    determineLocationCoords()
    createPlayer(COMPASS_DIR.SOUTH)
    initPlayerInput()

    
  }

  startGame()

  ///////////////////////////////////////////////////////////////////////////////

  function gameUpdate() {
    enemySpawnLoop()

    entities.map(sprite => {
      sprite.update()

      if(sprite.type === "enemy") {
        // if the enemy is beyond the right edge
        if(sprite.x > canvas.width - sprite.radius ||
           sprite.y > canvas.height - sprite.radius ||
           sprite.x < -sprite.radius ||
           sprite.y < -sprite.radius
        ) {
          sprite.ttl = 0
        }
      }

      // collision detection
      for (let i = 0; i < entities.length; i++) {

        // check enemy and player collision
        if (entities[i].type === 'enemy') {
          for (let j = 0; j < entities.length; j++) {
            if(entities[j].type === 'player' && i !== j) {
              let enemy = entities[i]
              let player = entities[j]
              if(circleCirCollision(enemy, player)) {
                enemy.ttl = 0
                console.log('enemy collides with player')
                // console.log(`enemy radius: ${enemy.radius}`)
                // console.log(`enemy scaleX: ${enemy.scaleX}`)
                break
              }
            }

            entities = entities.filter(sprite => sprite.isAlive())
          }
        }
      }
    })

    // despawn all dead entities
    entities = entities.filter(sprite => sprite.isAlive())
  }

  function gameRender() {
    drawLocations(context)
    entities.map(sprite => sprite.render())
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