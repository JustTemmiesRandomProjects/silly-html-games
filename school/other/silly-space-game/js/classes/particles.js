import { drawWithScreenWrap } from "../tems_library/tems_library.js"

// class to be extended into other classes, you should never actually instance this class
export class Particle {
    constructor (x, y, size, colour, ctx) {
        this.x = x
        this.y = y

        this.size = size

        this.colour = colour

        this.ctx = ctx

        this.isComplete = false
    }

    // because of technical reasons i'm using self here
    // tl;dr self = this
    drawAtPos(x, y, self) {
        self.ctx.beginPath()
        self.ctx.fillStyle = self.colour
        self.ctx.arc(x, y, self.size, 0, 2 * Math.PI)
        self.ctx.fill()

    }
    draw() {
        drawWithScreenWrap(
            this.x, this.y, this.size,
            this.drawAtPos, 5, this
        )
    }
    
    tick() {
        draw()
    }
}

export class LaserParticle extends Particle {
    constructor (x, y, size, colour, ctx) {
        super(x, y, size, colour, ctx)
    }

    tick() {
        this.size -= 0.5
        if ( this.size > 0 ) {
            this.draw()
        } else {
            this.isComplete = true
        }
    }
}