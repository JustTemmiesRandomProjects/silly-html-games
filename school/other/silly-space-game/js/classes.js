import { randFloat, randInt } from "./tems_library/tems_library.js";
import { settings } from "./tems_library/settings.js";
import { circleOverlapping } from "./tems_library/math.js"
import { global, canvas, ctx } from "./global.js";

// the sprite ID, defined in global.assets, and the size class
const meteor_sprites = {
    "big" : [
        "sprite_meteor_big_1",
        "sprite_meteor_big_3",
        "sprite_meteor_big_4",
    ],
    "medium" : [
        "sprite_meteor_med_1",
        "sprite_meteor_med_2",
    ],
    "small" : [
        "sprite_meteor_small_1",
        "sprite_meteor_small_2",
    ],
    // "tiny" : [
    //     "sprite_meteor_tiny_1",
    //     "sprite_meteor_tiny_2",
    // ]
}

export const meteor_sizes = Object.keys(meteor_sprites)

export class Circle {
    constructor(size) {
        this.size = size

        const meteorID = meteor_sprites[this.size][randInt(0, meteor_sprites[this.size].length)]
        const bonus_data = global.asset_bonus_data[meteorID]
        
        this.sprite = global.assets[meteorID]
        
        this.radius = bonus_data["hitboxRadius"]
        this.colour = bonus_data["hitboxColour"]

        this.rotation = randFloat(0, Math.PI*2)
        this.d_rotation = randFloat(-0.003, 0.006)


        const speed = randFloat(global.circle_speed_offset, global.circle_speed_rand)
        const random_angle = randFloat(0, Math.PI * 2);
        this.velocity = {
            "x": Math.cos(random_angle) * speed,
            "y": Math.sin(random_angle) * speed
        }
        this.position = {
            "x": randInt(this.radius, canvas.width - 2 * this.radius),
            "y": randInt(this.radius, canvas.height - 2 * this.radius)
        }
    }

    drawAtPos(x, y) {
        // transform and rotate the transformation matrix in order to rotate the sprite
        ctx.translate(x, y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.sprite.width/2, -this.sprite.height/2)
        ctx.drawImage(this.sprite, 0, 0)
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // if this setting in enabled, draw the hitbox
        if ( settings.show_hitboxes ) {
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
    async moveTowardsDirection(direction) {
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
        this.applyRotation(this.d_rotation)

        for (let i = 0; i < global.circles.length; i++) {
            if ( circleOverlapping(this, global.circles[i])) {
                this.handleCollision(this, global.circles[i])
            }
        }
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


    handleCollision(circle1, circle2) {                              
        // calculate the distance between the circles
        const distanceX = circle2.position.x - circle1.position.x;
        const distanceY = circle2.position.y - circle1.position.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // calculate the normal vector
        const normalX = distanceX / distance;
        const normalY = distanceY / distance;

        // calculate relative velocity
        const relativeVelocityX = circle2.velocity.x - circle1.velocity.x;
        const relativeVelocityY = circle2.velocity.y - circle1.velocity.y;

        // calculate relative speed along the normal vector
        const relativeSpeed = relativeVelocityX * normalX + relativeVelocityY * normalY;

        // check if the circles are moving towards each other
        if (relativeSpeed < 0) {
            // calculate impulse (change in momentum)
            const impulse = 2 * relativeSpeed / (1 / circle1.radius**2 + 1 / circle2.radius**2);

            // update velocities of the circles
            circle1.velocity.x += impulse * normalX / circle1.radius**2
            circle1.velocity.y += impulse * normalY / circle1.radius**2
            circle2.velocity.x -= impulse * normalX / circle2.radius**2
            circle2.velocity.y -= impulse * normalY / circle2.radius**2
        }
    }
}