import {
    getCanvas,
    SpriteClass
} from 'kontra'

export class Coin extends SpriteClass {
    constructor(props: object) {
        super({
            ...props,
            type: "coin",
            anchor: {
                x: 0.5,
                y: 0.5
            },
            radius: 15
        })
    }

    mov_speed = 5 // Coin moving speed
    scaling_speed = 0.02 // Coin scaling speed

    draw() {
        let { context, radius } = this;
        context.fillStyle = '#00ff00';
        context.beginPath();
        context.arc(0, 0, radius, 0, 2 * Math.PI);
        context.fill();
    }

    update() {
        this.travel()
    }

    travel() {
        if(this.direction === undefined || typeof this.direction !== 'number')
        {
            return
        }

        let angle = this.direction * (360 / 8) / 180 * Math.PI

        this.x += this.mov_speed * Math.cos(angle)
        this.y += this.mov_speed * Math.sin(angle)

        this.scaleX += this.scaling_speed
        this.scaleY += this.scaling_speed

        // update radius
        // this.radius = this.radius * this.scaleX
    }

}