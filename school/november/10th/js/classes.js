import { randFloat, randInt } from "./tems_library.js";
import { global, canvas, ctx } from "./global.js";

export class Circle {
    constructor(x, y, radius, angleOffset, angleMultiplier, speed) {
        this.x = x
        this.y = y
        this.radius = radius

        this.startColour = global.colours[randInt(0, global.colours.length)]
        this.colour = this.startColour

        const randomAngle = randFloat(angleOffset, angleMultiplier);
        this.dx = Math.cos(randomAngle) * speed
        this.dy = Math.sin(randomAngle) * speed
    }

    drawAtPos(x, y) {
        ctx.beginPath()
        ctx.arc(x, y, this.radius, 0, 2 * Math.PI)
        ctx.fillStyle = this.colour
        ctx.fill()
    }

    draw() {
        // handle the edges on the x plane
        if (this.x < this.radius) {
            this.drawAtPos(this.x + canvas.width, this.y)
        } else if (this.x > canvas.width - this.radius) {
            this.drawAtPos(this.x - canvas.width, this.y)
        }

        // handle the edges on the y plane
        if (this.y < this.radius) {
            this.drawAtPos(this.x, this.y + canvas.height)
        } else if (this.y > canvas.height - this.radius) {
            this.drawAtPos(this.x, this.y - canvas.height)
        }

        // draw the circle at the actual position
        this.drawAtPos(this.x, this.y)
    }

    // direction is an array
    moveTowardsDirection(direction) {
        this.x += direction[0]
        this.y += direction[1]
        if (this.x < 0) {
            this.x += canvas.width
        } else if (this.x > canvas.width) {
            this.x -= canvas.width
        }

        if (this.y < 0) {
            this.y += canvas.height
        } else if (this.y > canvas.height) {
            this.y -= canvas.height
        }
    }

    move() {
        this.moveTowardsDirection([this.dx, this.dy])
    }

    // directions:
    // pi * 0.5 = down
    // pi * 1 = left
    // pi * 1.5 = up
    // pi * 2 = right
    applyVelocity(direction, speed) {
        this.dx += Math.cos(direction) * speed
        this.dy += Math.sin(direction) * speed
    }
}