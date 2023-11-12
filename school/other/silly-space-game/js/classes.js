import { randFloat, randInt } from "./tems_library/tems_library.js";
import { global, canvas, ctx } from "./global.js";
import { settings } from "./tems_library/settings.js";

export class Circle {
    constructor(
        x, y,
        radius, sprite, hitboxColour, rotation, dRotation,
        angle_offset, angle_multiplier, speed) {
        const random_angle = randFloat(angle_offset, angle_multiplier);
        this.velocity = {
            "x": Math.cos(random_angle) * speed,
            "y": Math.sin(random_angle) * speed
        }
        this.position = {
            "x": x,
            "y": y
        }

        this.radius = radius
        this.rotation = rotation
        this.dRotation = dRotation

        // hitbox colour
        this.start_colour = hitboxColour
        this.colour = this.start_colour
        this.sprite = sprite
    }

    drawAtPos(x, y) {
        // transform and rotate the transformation matrix in order to rotate the sprite
        ctx.translate(x, y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.sprite.width/2, -this.sprite.height/2)
        ctx.drawImage(this.sprite, 0, 0)
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // if this setting in enabled, draw the hitbox
        if ( settings.showHitboxes ) {
            ctx.beginPath()
            ctx.arc(x, y, this.radius, 0, 2 * Math.PI)
            ctx.fillStyle = this.colour
            ctx.fill()
        }
    }

    draw() {
        // handle the edges on the x plane
        if (this.position["x"] < this.radius + 20) {
            this.drawAtPos(this.position["x"] + canvas.width, this.position["y"])
        } else if (this.position["x"] > canvas.width - this.radius - 20) {
            this.drawAtPos(this.position["x"] - canvas.width, this.position["y"])
        }

        // handle the edges on the y plane
        if (this.position["y"] < this.radius + 20) {
            this.drawAtPos(this.position["x"], this.position["y"] + canvas.height)
        } else if (this.position["y"] > canvas.height - this.radius - 20) {
            this.drawAtPos(this.position["x"], this.position["y"] - canvas.height)
        }

        // draw the circle at the actual position
        this.drawAtPos(this.position["x"], this.position["y"])
    }

    // direction is an array
    moveTowardsDirection(direction) {
        this.position["x"] += direction["x"]
        this.position["y"] += direction["y"]
        if (this.position["x"] < 0) {
            this.position["x"] += canvas.width
        } else if (this.position["x"] > canvas.width) {
            this.position["x"] -= canvas.width
        }

        if (this.position["y"] < 0) {
            this.position["y"] += canvas.height
        } else if (this.position["y"] > canvas.height) {
            this.position["y"] -= canvas.height
        }
    }

    applyRotation(rotation) {
        this.rotation += rotation
    }

    move() {
        this.moveTowardsDirection(this.velocity)
        this.applyRotation(this.dRotation)
    }
    // directions:
    // pi * 0.5 = down
    // pi * 1 = left
    // pi * 1.5 = up
    // pi * 2 = right
    applyVelocity(direction, speed) {
        this.velocity["x"] += Math.cos(direction) * speed
        this.velocity["y"] += Math.sin(direction) * speed
    }
}