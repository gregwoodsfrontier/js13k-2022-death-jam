import {
    SpriteClass,
    keyPressed,
    getCanvas,
    getContext
} from 'kontra'
import { PLAYER_DATA } from './player_data'

export class Player extends SpriteClass {
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

        window.addEventListener('keydown', (event) => {
            if(event.key === 'a')
            {
                this.rotation += Math.PI/4
                // if(this.state === 'idle') {
                //     this.clearSprite()
                //     this.state = 'left'
                // }
                // else if(this.state === 'left') {
                //     this.clearSprite()
                //     this.state = 'idle'
                // }
                
            }
        })
    }

    width = 0
    height = 0
    state = 'idle'

    draw() {
        if(this.state === 'idle')
        {
            this.drawCharacter(PLAYER_DATA.color, PLAYER_DATA.idle.encrypt, PLAYER_DATA.idle.width, PLAYER_DATA.idle.height)
        }
        else if(this.state === 'left')
        {
            this.drawCharacter(PLAYER_DATA.color, PLAYER_DATA.left.encrypt, PLAYER_DATA.left.width, PLAYER_DATA.left.height)
        }

        this.drawCollisionCircle()
        this.setScale(4, 4)
        // console.log(this.width, this.height)
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

    drawCharacter(color_data: string, frame_data: string, _width: number, _height: number) {
        let c = getContext()
        let C = color_data
        let px = [] as number[]
        for (let a of frame_data) {
            let z = a.charCodeAt(0)
            px.push(z & 7)
            px.push((z >> 3) & 7)
        }
        let W = _width
        let H = _height
        this.width = W
        this.height = H
        for (let j = 0; j < H; j++) {
            for (let i = 0; i < W; i++) {
                if (px[j * W + i]) {
                    // c.fillStyle = "#" + C.substr(6 * (px[j * W + i] - 1), 6)
                    let start = 6 * (px[j * W + i] - 1)
                    let end = start + 6
                    let pos = {
                        x: i - Math.floor(W/2),
                        y: j - Math.floor(H/2)
                    }
                    c.fillStyle = "#" + C.slice(start, end)
                    c.fillRect(pos.x , pos.y , 1, 1)
                }
            }
        }
    }
}