import {
    getCanvas,
    SpriteClass
} from 'kontra'

export class Enemy extends SpriteClass {
    constructor(props: object) {
        super({
            ...props,
            type: "enemy",
            anchor: {
                x: 0.5,
                y: 0.5
            },
            radius: 15,
            opacity: 0.75
        })
    }

    mov_speed = 5 // Enemy moving speed
    scaling_speed = 0.02 // Enemy scaling speed

    draw() {
        let { context, radius } = this;
        context.fillStyle = '#b3a378';
        context.beginPath();
        context.arc(0, 0, radius, 0, 2 * Math.PI);
        context.fill();
    }

    update() {
        this.travelMethod()
    }

    travelMethod() {
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