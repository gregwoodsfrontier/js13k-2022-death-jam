import {
    SpriteClass,
    keyPressed,
    getCanvas,
    getContext
} from 'kontra'

const COLOR_DATA = '2a173b95c5ac4c5c8769809e443f7b3f2c5f'
const ENCRYPT_DATA = '@@@@IIIA@@@@@@HQRRRI@@@@@HR[[[SJ@@@@HZ[[[[[J@@@@a[[[[[cA@@@HedddddM@@@@qmmmmmuA@@@H^[ts\\[N@@HIq[Z^^ZsIIHbL^k^[n[NdJamK^[[[[NkeAIiM^[[[NmIA@@INm[kMNA@@@@HNIIIN@@@@@@HvvvN@@@@@@@i[[kA@@@@@@HvvvN@@@@@@@imImA@@@@@@HmAIA@@@@@@@HIHM@@@@@@@@iAH@@@@@@@@@A@@@@@@'
export class Player extends SpriteClass {
    constructor(props: object) {
        super({
            ...props,
            type: "player",
            anchor: {
                x: 0.5,
                y: 0.5
            },
            radius: 11
        })
    }

    draw() {
        this.drawCharacter()
        this.drawCollisionCircle()
        this.setScale(4, 4)
    }

    drawCollisionCircle() {
        let { context, radius } = this;
        context.fillStyle = 'rgba(255, 255, 0, 0.25)'
        context.beginPath();
        context.arc(0, 0, radius, 0, 2 * Math.PI);
        context.fill();
    }

    drawCharacter() {
        let c = getContext()
        let C = COLOR_DATA
        let px = [] as number[]
        for (let a of ENCRYPT_DATA) {
            let z = a.charCodeAt(0)
            px.push(z & 7)
            px.push((z >> 3) & 7)
        }
        let W = 23
        let H = 22
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