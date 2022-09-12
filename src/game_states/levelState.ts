import { 
    Sprite,
    Text,
    getCanvas,
    getContext,
    clamp,
    randInt,
    getStoreItem,
    setStoreItem
} from 'kontra';
import { Coin } from '../coin';
import { Enemy } from '../enemy';
import { menuState } from '../game_states/menuState';
import { Player, PLAYER_STATE } from '../player';
import { circleCirCollision, getFrameNumFromTime } from '../utils';
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
    private timerText!: Text
    private score = 0
    private entities: Sprite[] = []
    private location_coords: CoordType[] = []
    private CANVAS_CENTER!: CoordType
    private PATTERN_R = 0
    private LOCATION_R = 0
    private hitCount = 0

    globalCount = 0
    counter = 0
    switch = 0
    private threshold = [ 60 * 20, 60 * 10 ]
    currThres = this.threshold[0]
    isCoinSpawn = true
    spawnThres = 45
    rampPeriod = 0;

    onEnter () {
        let context = getContext()
        this.canvas = getCanvas()
        this.CANVAS_CENTER = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        }
        this.PATTERN_R = this.canvas.width * 0.4
        this.LOCATION_R = this.canvas.width * 0.1

        this.resetParams()

        this.createScoreText()
        this.createTime()
        this.determineLocationCoords()
        this.drawLocations(context)
        this.createPlayer(COMPASS_DIR.SOUTH)
        this.initPlayerInput()
    }

    resetParams() {
        this.hitCount = 0
        this.counter = 0
        this.globalCount = 0
        this.switch = 0
        this.isCoinSpawn = true
        this.currThres = this.threshold[0]
        this.spawnThres = 45
        this.rampPeriod = 60 * 60
    }

    onUpdate () {
        this.checkGameOver()

        this.updateGlobalCount()

        this.launchDifficultyRamp()

        this.spawn()

        this.checkCollision()
        // update each entity
        this.entities.map(entity => entity.update());
        // remove destroyed entities
        this.entities = this.entities.filter(entity => entity.isAlive());
    }

    onRender () {
        this.entities.map(entity => entity.render())
        this.renderUI()
    }

    checkGameOver() {
        if(this.hitCount > 2) {
            this.onGameOver()
        }
    }

    spawn() {
        // updates counter per frame
        this.counter += 1
        this.switch += 1

        let player = this.getPlayer()
        let playerDir = player?.getDirection
        if(playerDir === undefined) { return }

        this.currThres = this.threshold[this.isCoinSpawn ? 0 : 1]

        if(this.switch > this.currThres) {
            this.isCoinSpawn = !this.isCoinSpawn

            this.switch = 0
        }

        // spawn obj after 45 frames
        if (this.counter > 45) {
            // this.createEnemy(playerDir)
            if(this.isCoinSpawn) {
                let spawnDir = randInt(playerDir - 2, playerDir + 2)
                this.createCoin(spawnDir)
            }
            else {
                // console.log('start enemy loop')
                let gapDir = randInt(0, 7)
                for (let i = 0; i < 3; i++) {
                    let startDir = i + 1 + gapDir
                    if (startDir > 7) {
                        startDir = startDir - 8
                    }
                    this.createEnemy(startDir)
                }
            }

            this.counter = 0
        }
    }

    launchDifficultyRamp () {
        if (this.counter > this.rampPeriod) {
            this.spawnThres *= 0.9
            this.rampPeriod += 60 * 180
        }
        return
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
                                this.onEnemyCollision()
                            }
                            break;
                        case 'coin':
                            if(circleCirCollision(en, en2))
                            {
                                arr.splice(idx2, 1)
                                en2.ttl = 0
                                this.onCoinCollision()
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

    onEnemyCollision() {
        this.changeScore(-60)
        this.hitCount += 1
    }

    onCoinCollision() {
        this.changeScore(COIN_SCORE)
    }

    renderUI() {
        let {scoreText, score, timerText} = this
        scoreText.text = `${score}`
        scoreText.render()

        let secondText = this.getSeconds(this.globalCount) < 10 ? `0${this.getSeconds(this.globalCount)}` : `${this.getSeconds(this.globalCount)}`
        timerText.text = `${this.getMinutes(this.globalCount)}:`+secondText
        timerText.render()
    }

    getMinutes(count: number) {
        return Math.floor(count / (60 * 60))
    }

    getSeconds(count: number) {
        return Math.floor(count / 60)
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

    createTime() {
        this.timerText = Text({
            text: `0:00`,
            font: '77px Arial',
            color: 'white',
            x: this.canvas.width - 100,
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

    onGameOver() {
        
        window.removeEventListener(KEY_DOWN, this.defineInputEvent)

        const nowHigh = getStoreItem('highscore')
        
        if(this.score > nowHigh) {
            setStoreItem('highscore', this.score)
        }

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