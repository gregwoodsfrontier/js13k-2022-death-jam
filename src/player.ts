import {
    SpriteClass,
    keyPressed,
    getCanvas
} from 'kontra'

export class Player extends SpriteClass {
    constructor(props: object) {
        let side = 20

        super({
            ...props,
            type: "player",
            anchor: {
                x: 0.5,
                y: 0.5
            },
            radius: 30
        })
    }

    draw() {
        let { context, radius } = this;
        context.fillStyle = '#0ff';
        context.beginPath();
        context.arc(0, 0, radius, 0, 2 * Math.PI);
        context.fill();
    }
}