import {
    SpriteClass,
    getContext,
    getCanvas,
    clamp
} from 'kontra'
import { ICharacter } from './characterType'
import { PLAYER_DATA } from './spriteData'
import { tweenFunctions } from './tween_functions'
import { drawCharacter, getRadFromCompass } from './utils'
import { CoordType } from './game_states/levelState'

export enum PLAYER_STATE {
    LEFT,
    IDLE,
    RIGHT
}

export class Player extends SpriteClass implements ICharacter {
    constructor(props: object) {
        super({
            ...props,
            type: "player",
            anchor: {
                x: 0,
                y: 0
            },
            radius: 11
        })
    }
    private canvas = getCanvas()

    type = "player"
    radius = 11
    direction = 2

    width = 0
    height = 0
    anim_state = PLAYER_STATE.IDLE
    context = getContext()
    ang_period = 1000
    ang_interval = Math.PI / 4
    ang_speed = this.ang_interval / this.ang_period

    counter = 0

    private CANVAS_CENTER!: CoordType
    private PATTERN_R = 0
    private LOCATION_R = 0

    update() {
        this.canvas = getCanvas()
        this.CANVAS_CENTER = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        }
        this.PATTERN_R = this.canvas.width * 0.4
        this.LOCATION_R = this.canvas.width * 0.1
    }

    draw() {

        switch (this.anim_state) {
            case PLAYER_STATE.IDLE: {
                drawCharacter(this.context, PLAYER_DATA.color, PLAYER_DATA.idle.encrypt, PLAYER_DATA.idle.width, PLAYER_DATA.idle.height)
                this.setScale(4, 4)
                this.counter = 0
                break
            }
            case PLAYER_STATE.LEFT: {
                drawCharacter(this.context, PLAYER_DATA.color, PLAYER_DATA.left.encrypt, PLAYER_DATA.left.width, PLAYER_DATA.left.height)
                this.setScale(4, 4)
                break
            }
            case PLAYER_STATE.RIGHT: {
                drawCharacter(this.context, PLAYER_DATA.color, PLAYER_DATA.left.encrypt, PLAYER_DATA.left.width, PLAYER_DATA.left.height)
                this.setScale(-4, 4)
                break
            }
        }

        // this.drawCollisionCircle()
        this.launchMovement(this.anim_state)
    }

    

    // update() {
    //     this.counter += 1 
    //     let tweenVal = tweenFunctions.linear({
    //         t: this.counter,
    //         b: 0,
    //         _c: 1,
    //         d: 60
    //     })
    //     if(tweenVal > 0.99) { return }
    //     console.log(tweenVal)
    // }

    get getAnimState() {
        return this.anim_state
    }

    setLocation(ang: number) {
        this.rotation = -Math.PI / 2 + ang
        this.position.x = this.CANVAS_CENTER.x + Math.cos(ang) * this.PATTERN_R
        this.position.y = this.CANVAS_CENTER.x + Math.sin(ang) * this.PATTERN_R
    }

    drawCollisionCircle() {
        let { context, radius } = this;
        context.fillStyle = 'rgba(255, 255, 0, 0.25)'
        context.beginPath();
        context.arc(0, 0, radius, 0, 2 * Math.PI);
        context.fill();
    }

    clearSprite() {
        let c = getContext()
        let actual_size = {
            w: this.width * this.scaleX,
            h: this.height * this.scaleY
        }
        let crop_loc = {
            x: this.x - actual_size.w / 2,
            y: this.y -actual_size.h / 2
        }
        c.clearRect(crop_loc.x, crop_loc.y, actual_size.w, actual_size.h)
    }

    setDirection(_dir: number) {
        const limit = 7
        if (_dir > 7) {
            return 0
        }
        else if (_dir < 0) {
            return limit
        }
        
        return _dir
    }

    launchMovement(_state: number) {
        let startAng = getRadFromCompass(this.direction)
        let endAng = 0
        let currAngle = 0
        let temp = 0
        let framTime = 12
        
        if (_state === PLAYER_STATE.LEFT) {
            endAng = startAng + Math.PI / 4
            temp = tweenFunctions.linear({
                t: ++this.counter,
                b: startAng,
                _c: endAng,
                d: framTime
            })
            currAngle = clamp(startAng, endAng, temp)

            if(currAngle >= endAng) {
                this.anim_state = PLAYER_STATE.IDLE
                this.direction = this.setDirection(this.direction + 1)
            }
        }
        else if (_state === PLAYER_STATE.RIGHT) {
            endAng = startAng - Math.PI / 4
            temp = tweenFunctions.linear({
                t: ++this.counter,
                b: startAng,
                _c: endAng,
                d: framTime
            })
            currAngle = clamp(endAng, startAng, temp)

            if(currAngle <= endAng) {
                this.anim_state = PLAYER_STATE.IDLE
                this.direction = this.setDirection(this.direction - 1)
            }
        }
        else if (_state === PLAYER_STATE.IDLE) {
            return
        }
        else {
            console.error('Player state error')
            return
        }

        this.setLocation(currAngle)
    }

    moveInArc(isClock: boolean) {

        if(isClock) {
            this.anim_state = PLAYER_STATE.LEFT
        }
        else {
            this.anim_state = PLAYER_STATE.RIGHT
        }

        // when the player is in either left/ right, the player cont to move regardless of input

        // let currAngle = tweenFunctions.linear({
        //     t: ++this.counter,
        //     b: startAng,
        //     _c: endAng,
        //     d: 35
        // })


        // if(startAng < endAng) {
        //     currAngle = clamp(startAng, endAng, currAngle)
        // }
        // else {
        //     currAngle = clamp(endAng, startAng, currAngle)
        // }

        // this.setLocation(currAngle)
        
    }
}