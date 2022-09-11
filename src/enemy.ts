import {
    clamp,
    SpriteClass,
    SpriteSheet,
    Sprite,
    getContext,
    getCanvas
} from 'kontra'
import { ICharacter } from './characterType'
import { ENEMY_DATA } from './spriteData'
import { tweenFunctions } from './tween_functions'
import { drawCharacter } from './utils'

function createSpriteSheet() {
    let canvasB = document.createElement('canvas')
    let contextB = canvasB.getContext('2d')
    drawCharacter(contextB, ENEMY_DATA.SKULL.color, ENEMY_DATA.SKULL.encrypt, ENEMY_DATA.SKULL.width, ENEMY_DATA.SKULL.height)

    let spritesheet = SpriteSheet({
        image: canvasB,
        frameWidth: ENEMY_DATA.SKULL.width / 3,
        frameHeight: ENEMY_DATA.SKULL.height,
        animations: {
            walk: {
                frames: [1,2],
                frameRate: 30
            }
        }
    })

    return spritesheet
}

export class Enemy extends SpriteClass implements ICharacter{
    constructor(props: object) {
        super({
            ...props,
            anchor: {
                x: 0.5,
                y: 0.5
            },
            opacity: 0.75
        })

        let ss = this.testCreateSpriteSheet()
        console.log(ss)
        this.animations = ss.animations
        // console.log(ss)
    }

    direction = 0
    type = "enemy"
    radius = 15

    counter = 0

    mov_speed = 7 // Enemy moving speed

    set setDirection(_dir: number) {
        this.direction = clamp(0, 7, _dir)
    }

    get getDirection() {
        return this.direction
    }

    testCreateSpriteSheet() {
        drawCharacter(getContext(), ENEMY_DATA.SKULL.color, ENEMY_DATA.SKULL.encrypt, ENEMY_DATA.SKULL.width, ENEMY_DATA.SKULL.height)

        let spritesheet = SpriteSheet({
            image: getCanvas(),
            frameWidth: ENEMY_DATA.SKULL.width / 3,
            frameHeight: ENEMY_DATA.SKULL.height,
            animations: {
                walk: {
                    frames: '0..2',
                    frameRate: 30
                }
            }
        })

        return spritesheet
    }

    draw() {
        // drawCharacter(this.context, ENEMY_DATA.SKULL.color, ENEMY_DATA.SKULL.encrypt, ENEMY_DATA.SKULL.width, ENEMY_DATA.SKULL.height)
    }

    drawCollisionCircle() {
        let { context, radius } = this;
        context.fillStyle = '#b3a378';
        context.beginPath();
        context.arc(0, 0, radius, 0, 2 * Math.PI);
        context.fill();
    }

    update() {
        this.travelMethod()
    }

    scaleUpdate() {
        let currScale = tweenFunctions.linear({
            t: ++this.counter,
            b: 1,
            _c: 2,
            d: 35
        })
        this.setScale(currScale)
    }

    travelMethod() {
        if(this.direction === undefined || typeof this.direction !== 'number')
        {
            return
        }

        let angle = this.direction * (360 / 8) / 180 * Math.PI

        this.x += this.mov_speed * Math.cos(angle)
        this.y += this.mov_speed * Math.sin(angle)

        this.scaleUpdate()
    }

}