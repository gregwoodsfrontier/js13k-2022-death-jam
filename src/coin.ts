import {
    SpriteClass,
    Sprite,
    SpriteSheet,
    clamp
} from 'kontra'
import { tweenFunctions } from './tween_functions'
import { COIN_DATA } from './spriteData'
import { drawSprite } from './utils'

export class Coin extends SpriteClass {
    constructor(props: object) {
        super({
            ...props,
            anchor: {
                x: 0.5,
                y: 0.5
            },
            opacity: 0.75
        })

        this.sprite = this.makeSpriteSheet()
    }

    direction = 0
    type = "coin"
    radius = 8

    counter = 0

    mov_speed = 5 // Coin moving speed
    sprite: Sprite

    set setDirection(_dir: number) {
        this.direction = clamp(0, 7, _dir)
    }

    get getDirection() {
        return this.direction
    }

    draw() {

        this.sprite.render()
        // this.drawCollisionCircle('#00ff00')
    }

    drawCollisionCircle(color: string) {
        let { context, radius } = this;
        context.fillStyle = color;
        context.beginPath();
        context.arc(0, 0, radius, 0, 2 * Math.PI);
        context.fill();
    }

    update() {
        this.travel()
        this.sprite.update()
    }

    makeSpriteSheet(): Sprite {

        let canvasB = document.createElement('canvas')
        let oCtx = canvasB.getContext('2d')

        canvasB.width = 128
        canvasB.height = 100

        //@ts-ignore
        drawSprite(oCtx, COIN_DATA.color, COIN_DATA.encrypt, COIN_DATA.width, COIN_DATA.height)

        let spritesheet = SpriteSheet({
            image: canvasB,
            frameWidth: COIN_DATA.width / 8,
            frameHeight: COIN_DATA.height,
            animations: {
                walk: {
                    frames: '0..7',
                    frameRate: 20
                }
            }
        })

        return Sprite({
            x: 0,
            y: 0,
            anchor: {
                x: 0.5,
                y: 0.5
            },
            animations: spritesheet.animations
        })       
    }

    scaleUpdate() {
        let currScale = tweenFunctions.linear({
            t: ++this.counter,
            b: 2,
            _c: 3,
            d: 35
        })
        this.setScale(currScale)
    }

    travel() {
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