import {
    SpriteClass,
    keyPressed,
    getCanvas
} from 'kontra'

export class Player extends SpriteClass {
    constructor(props) {
        let side = 20

        super({
            ...props,
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

    update() {
        this.defineKeyInputs()
        this.relocate()
    }

    defineKeyInputs() {
        let keyboardDirection = keyPressed('arrowright') - keyPressed('arrowleft');
        if (keyboardDirection) {
          this.x += 10 * keyboardDirection
        }
    }

    relocate() {
        let canvas = getCanvas()
        if (this.x > canvas.width || this.x < 0) {
            this.x = canvas.width / 2;
        }
    }
}