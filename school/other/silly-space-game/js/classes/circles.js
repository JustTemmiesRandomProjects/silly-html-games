import { drawWithScreenWrap, randFloat, randInt } from "../tems_library/tems_library.js";
import { settings } from "../tems_library/settings.js";
import { circleOverlapping } from "../tems_library/math.js"
import { global, ctx } from "../global.js";

// the sprite ID, defined in global.assets, and the size class
export const meteor_sprites = {
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
    // only size_index is required
    constructor(size_index, position, random_angle, speed) {
        this.ID = global.next_circle_ID
        global.next_circle_ID ++
        
        this.size_index = size_index
        this.size = meteor_sizes[size_index]

        const meteorID = meteor_sprites[this.size][randInt(0, meteor_sprites[this.size].length)]
        const bonus_data = global.asset_bonus_data[meteorID]

        
        this.sprite = global.assets[meteorID]
        
        this.radius = bonus_data["hitboxRadius"]
        this.colour = bonus_data["hitboxColour"]
        
        this.rotation = randFloat(0, Math.PI*2)
        this.d_rotation = randFloat(-0.004, 0.008)
        
        this.immunity_frames = 10
        
        if ( speed == undefined ) {
            speed = randFloat(global.circle_speed_offset, global.circle_speed_rand)
        }
        if ( random_angle == undefined ) {
            random_angle = randFloat(0, Math.PI * 2);
        }
        this.random_angle = random_angle

        this.velocity = {
            "x": Math.cos(random_angle) * speed,
            "y": Math.sin(random_angle) * speed
        }

        if ( position == undefined ) {
            this.position = {
                "x": randInt(this.radius, ctx.canvas.width - 2 * this.radius),
                "y": randInt(this.radius, ctx.canvas.height - 2 * this.radius)
            }
        }
        else {
            this.position = position
        }
    }

    // because of technical reasons i'm using self here
    // tl;dr self = this
    drawAtPos(x, y, self) {
        // transform and rotate the transformation matrix in order to rotate the sprite
        ctx.translate(x, y);
        ctx.rotate(self.rotation);
        ctx.translate(-self.sprite.width/2, -self.sprite.height/2)
        ctx.drawImage(self.sprite, 0, 0)
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // if this setting in enabled, draw the hitbox
        if ( settings.show_hitboxes ) {
            ctx.beginPath()
            ctx.arc(x, y, self.radius, 0, 2 * Math.PI)
            ctx.fillStyle = self.colour
            ctx.fill()
        }
    }

    draw() {
        drawWithScreenWrap(
            this.position["x"], this.position["y"], this.radius,
            this.drawAtPos, 10, this
        )
    }

    // direction is an array
    moveTowardsDirection(direction) {
        this.position["x"] += direction["x"]
        this.position["y"] += direction["y"]
        if (this.position["x"] < 0) {
            this.position["x"] += ctx.canvas.width
        } else if (this.position["x"] > ctx.canvas.width) {
            this.position["x"] -= ctx.canvas.width
        }

        if (this.position["y"] < 0) {
            this.position["y"] += ctx.canvas.height
        } else if (this.position["y"] > ctx.canvas.height) {
            this.position["y"] -= ctx.canvas.height
        }
    }

    applyRotation(rotation) {
        this.rotation += rotation
    }

    tick() {
        if ( this.immunity_frames >= 1 ) {
            this.immunity_frames -= 1
        } 
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