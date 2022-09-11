import { 
    Sprite,
    Text,
    getCanvas,
    getContext,
    clamp
} from 'kontra';
import { Coin } from '../coin';
import { Enemy } from '../enemy';
import { menuState } from '../game_states/menuState';
import { Player, PLAYER_STATE } from '../player';
import { circleCirCollision } from '../utils';
import { IState } from "../state";
import { COMPASS_DIR } from '../compassDir';
import { gameStateMachine } from '../game_state_machine';

const NUM_OF_LOC = 8
const OBJ_SPAWN_R = 30

const COIN_SCORE = 50
const KEY_DOWN = 'keydown'
const ARROW_LEFT = "ArrowLeft"
const ARROW_RIGHT = "ArrowRight"

export type CoordType = {
    x: number,
    y: number
}



class LevelState implements IState {
    private canvas = getCanvas()
    private scoreText!: Text
    private score = 0
    private entities: Sprite[] = []
    private location_coords: CoordType[] = []
    private CANVAS_CENTER!: CoordType
    private PATTERN_R = 0
    private LOCATION_R = 0

    globalCount = 0
    counter = 0

    onEnter () {
        let context = getContext()
        this.canvas = getCanvas()
        this.CANVAS_CENTER = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        }
        this.PATTERN_R = this.canvas.width * 0.4
        this.LOCATION_R = this.canvas.width * 0.1

        this.createScoreText()
        this.determineLocationCoords()
        this.drawLocations(context)
        this.createPlayer(COMPASS_DIR.SOUTH)
        this.initPlayerInput()
    }

    onUpdate () {
        this.updateGlobalCount()
        
        this.spawn()

        this.checkCollision()
        // update each entity
        this.entities.map(entity => entity.update());
        // remove destroyed entities
        this.entities = this.entities.filter(entity => entity.isAlive());
    }

    onRender () {
        // let context = getContext()
        this.entities.map(entity => entity.render())
        // this.drawLocations(context)
        this.renderUI()
    }

    spawn() {
        // updates counter per frame
        this.counter += 1

        // spawn obj after 30 frames
        if (this.counter > 30) {
            let player = this.getPlayer()
            let playerDir = player?.getDirection
            if(!playerDir) { return }
            this.createEnemy(playerDir)

            this.counter = 0
        }
    }

    updateGlobalCount() {
        this.globalCount += 1
    }

    checkCollision() {
        this.entities.map((en: Sprite, idx: number, arr: Sprite[]) => {
            if (this.checkOutOfBounds(en)) {
                arr.splice(idx, 1)
                en.ttl = 0
            }

            if(!en.type || en.type !== 'player') { 
                return 
            }
            else if (en.type === 'player') {
                this.entities.map((en2, idx2, arr) => {
                    switch (en2.type) {
                        case 'enemy':
                            if(circleCirCollision(en, en2))
                            {
                                arr.splice(idx2, 1)
                                en2.ttl = 0
                                this.changeScore(-10)
                                console.log('enemy collided')
                            }
                            break;
                        case 'coin':
                            if(circleCirCollision(en, en2))
                            {
                                arr.splice(idx2, 1)
                                en2.ttl = 0
                                this.changeScore(50)
                                console.log('coin collided')
                            }
                            break;
                        default:
                            // console.error('The type of collided sprite does not exist')
                            return;
                    }
                })
            }
        })
    }

    renderUI() {
        let {scoreText, score} = this
        scoreText.text = `${score}`
        scoreText.render()
    }

    initPlayerInput() {
        window.addEventListener(KEY_DOWN, this.defineInputEvent)
    }

    defineInputEvent = (event: KeyboardEvent) => {
        let player = this.entities.find(e => e.type === 'player') as Player
        if(!player){ return }

        if(player.getAnimState !== PLAYER_STATE.IDLE){ return }

        if(event.key === ARROW_LEFT)
        {
        //   this.movePlayerInClock(true)
            player.moveInArc(true)
        }
        else if(event.key === ARROW_RIGHT)
        {
        //   this.movePlayerInClock(false)
            player.moveInArc(false)
        }
    }

    getPlayer() {
        let player = this.entities.find(e => e.type === 'player') as Player
        if(!player) { return undefined }

        return player
    }

    createScoreText() {
        this.scoreText = Text({
            text: `${this.score}`,
            font: '77px Arial',
            color: 'white',
            x: 100,
            y: 50,
            anchor: {x: 0.5, y: 0.5}
        });
    }

    determineLocationCoords() {
        for (let i = 0; i < NUM_OF_LOC; i++) {
            let angle = i * (360 / 8) / 180 * Math.PI
            let coords = {
                x: this.CANVAS_CENTER.x + Math.cos(angle) * this.PATTERN_R,
                y: this.CANVAS_CENTER.y + Math.sin(angle) * this.PATTERN_R
            }
            this.location_coords.push(coords)
        }
    }

    createPlayer(loc_num: number) {
        let player = new Player({
            x: this.location_coords[loc_num].x,
            y: this.location_coords[loc_num].y,
            direction: loc_num
        })
        player.x = this.location_coords[loc_num].x
        player.y = this.location_coords[loc_num].y
        player.direction = loc_num
        
        this.entities.push(player)
    }

    createEnemy(_dir: number) {
        let angle = _dir * (360 / 8) / 180 * Math.PI
        
        let enemy = new Enemy({
            x: this.CANVAS_CENTER.x + Math.cos(angle) * OBJ_SPAWN_R,
            y: this.CANVAS_CENTER.y + Math.sin(angle) * OBJ_SPAWN_R,
        })
        enemy.setDirection = _dir

        this.entities.push(enemy)
    }

    createCoin(_dir: number) {
        let angle = _dir * (360 / 8) / 180 * Math.PI
        
        let coin = new Coin({
            x: this.CANVAS_CENTER.x + Math.cos(angle) * OBJ_SPAWN_R,
            y: this.CANVAS_CENTER.y + Math.sin(angle) * OBJ_SPAWN_R,
        })
        coin.setDirection = _dir
        this.entities.push(coin)
    }

    checkOutOfBounds(spr: Sprite) {
        return spr.x > this.canvas.width - spr.radius ||
        spr.y > this.canvas.height - spr.radius ||
        spr.x < -spr.radius ||
        spr.y < -spr.radius
    }

    drawLocations(context: CanvasRenderingContext2D) {
        for (let i = 0; i < this.location_coords.length; i++) {
            let location = Sprite({
                x: this.location_coords[i].x,
                y: this.location_coords[i].y,
                color: 'white',
                type: 'location',
                render: function() {
                    context.fillStyle = this.color ? this.color : "";
                    context.beginPath();
                    context.arc(0, 0, 15, 0, 2  * Math.PI);
                    context.fill();
                }
            })
            this.entities.push(location)
            // location.render()
        }
    }

    setPlayerLocation(dir: number) {
        let player = this.entities.find(e => e.type === 'player')
        if(!player){ return }

        player.x = this.location_coords[dir].x
        player.y = this.location_coords[dir].y
        player.direction = dir
    }
    
    changeScore(chng: number) {
        this.score = clamp(0, 99999, this.score + chng)
    }
    
    // movePlayerInClock(isClock: boolean)
    // {
    //     const limit = this.location_coords.length - 1
    //     let player = this.entities.find(e => e.type === 'player') as Player

    //     if(!player){ return }

    //     if(isClock)
    //     {
    //         // instead of updating the player direction here, do that in the player class
    //         player.direction = player.direction + 1 > limit ? 0 : player.direction + 1
    //         // player.moveInArc(isClock)
    //     }
    //     else
    //     {
    //         player.direction = player.direction - 1 < 0 ? limit : player.direction - 1
    //     }

    //     this.setPlayerLocation(player.direction)
    // }

    onGameOver() {
        
        window.removeEventListener(KEY_DOWN, this.defineInputEvent)

        this.despawnEntities()
        // go to menu state and set gameover as true
        gameStateMachine.setState(menuState, true)
    }

    despawnEntities() {
        for (let en of this.entities) {
            en.ttl = 0
        }
        this.entities = []
    }
}

export const levelState = new LevelState()