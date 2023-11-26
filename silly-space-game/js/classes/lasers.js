import { global, ctx } from "../global.js"

export class Laser {
    constructor (x, y, targetX, targetY, colour, width, decay_speed) {
        this.x = x
        this.y = y

        this.targetX = targetX
        this.targetY = targetY

        this.colour = colour
        this.width = width
        this.decay_speed = decay_speed
    }
    
    drawAtPos(x, y, targetX, targetY) {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(targetX, targetY)
        ctx.lineWidth = this.width
        ctx.strokeStyle = this.colour
        ctx.stroke()
    }

    draw() {
        this.drawAtPos(this.x, this.y, this.targetX, this.targetY)
    }

    tick() {
        this.draw()
        this.width -= this.decay_speed
    }
}