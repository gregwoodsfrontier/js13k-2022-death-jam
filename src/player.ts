import {
    SpriteClass,
    getContext,
    clamp
} from 'kontra'
import { ICharacter } from './characterType'
import { PLAYER_DATA } from './spriteData'
import { tweenFunctions } from './tween_functions'
import { drawCharacter } from './utils'

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

    type = "player"
    radius = 11
    direction = 2

    width = 0
    height = 0
    anim_state = 'idle'
    context = getContext()
    ang_period = 1000
    ang_interval = Math.PI / 4
    ang_speed = this.ang_interval / this.ang_period

    counter = 0 

    draw() {

        switch (this.anim_state) {
            case 'idle': {
                drawCharacter(this.context, PLAYER_DATA.color, PLAYER_DATA.idle.encrypt, PLAYER_DATA.idle.width, PLAYER_DATA.idle.height)
                this.setScale(4, 4)
                break
            }
            case 'left': {
                drawCharacter(this.context, PLAYER_DATA.color, PLAYER_DATA.left.encrypt, PLAYER_DATA.left.width, PLAYER_DATA.left.height)
                this.setScale(4, 4)
                break
            }
            case 'right': {
                drawCharacter(this.context, PLAYER_DATA.color, PLAYER_DATA.left.encrypt, PLAYER_DATA.left.width, PLAYER_DATA.left.height)
                this.setScale(-4, 4)
                break
            }
        }

        this.drawCollisionCircle()

        this.rotation = -Math.PI / 2 + Math.PI / 4 * this.direction 
        
        // console.log(this.width, this.height)
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

    moveInArc(isClock: boolean) {
        const limit = 7
        let { direction } = this
        let end_dir = 0
        if(isClock) {
            end_dir = direction + 1 > limit ? 0 : direction + 1
        }
        else {
            end_dir = direction - 1 < 0 ? limit : direction - 1
        }
        
    }
}