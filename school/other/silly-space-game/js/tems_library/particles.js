export class Particle {
    constructor (x, y, size, colour, ctx) {
        this.x = x
        this.y = y

        this.size = size

        this.colour = colour

        this.ctx = ctx

        this.isComplete = false
    }

    draw() {
        this.ctx.beginPath()
        this.ctx.fillStyle = this.colour
        this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        this.ctx.fill()
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