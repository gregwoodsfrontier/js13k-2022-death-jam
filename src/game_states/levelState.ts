import { 
    init,
    initKeys,
    Sprite,
    randInt,
    Text,
    getCanvas,
    getContext
} from 'kontra';
import { Coin } from '../coin';
import { Enemy } from '../enemy';
import { menuState } from '../game_states/menuState';
import { Player } from '../player';
import { circleCirCollision } from '../utils';
import { IState } from "../state";
import { COMPASS_DIR } from '../compassDir';

let { canvas, context } = init();

// const canvas = getCanvas()
canvas.width = 640
canvas.height = 640

const PATTERN_R = canvas.width * 0.4
const LOCATION_R = canvas.width * 0.02
const NUM_OF_LOC = 8
const OBJ_SPAWN_R = 30

const COIN_SCORE = 50
const KEY_DOWN = 'keydown'
const ARROW_LEFT = "ArrowLeft"
const ARROW_RIGHT = "ArrowRight"

type CoordType = {
    x: number,
    y: number
}



class LevelState implements IState {
    private canvas = getCanvas()
    private scoreText!: Text
    private score = 0
    private entities: Sprite[] = []
    private location_coords: CoordType[] = []
    private CANVAS_CENTER = {
        x: this.canvas.width / 2,
        y: this.canvas.height / 2
    }
    private PATTERN_R = this.canvas.width * 0.4
    private LOCATION_R = this.canvas.width * 0.02  

    onEnter () {
        this.createScoreText()
        this.determineLocationCoords()
    }

    onUpdate () {
        console.log('Level state on Update')
        // put your game logic here
    }

    onRender () {
        this.drawLocations(getContext())
        this.renderUI()
    }

    renderUI() {
        let {scoreText, score} = this
        scoreText.text = `${score}`
        scoreText.render()
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
                x: this.CANVAS_CENTER.x + Math.cos(angle) * PATTERN_R,
                y: this.CANVAS_CENTER.y + Math.sin(angle) * PATTERN_R
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

    createCoin() {

    }

    drawLocations(context: CanvasRenderingContext2D) {
        for (let i = 0; i < this.location_coords.length; i++) {
            let location = Sprite({
            x: this.location_coords[i].x,
            y: this.location_coords[i].y,
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

    setPlayerLocation(dir: number) {
        let player = this.entities.find(e => e.type === 'player')
        if(!player){ return }

        player.x = this.location_coords[dir].x
        player.y = this.location_coords[dir].y
        player.direction = dir
    }    
    
    movePlayerInClock(isClock: boolean)
    {
        const limit = this.location_coords.length - 1
        let player = this.entities.find(e => e.type === 'player')

        if(!player){ return }

        if(isClock)
        {
            player.direction = player.direction + 1 > limit ? 0 : player.direction + 1
        }
        else
        {
            player.direction = player.direction - 1 < 0 ? limit : player.direction - 1
        }
    }
}

export const levelState = new LevelState()