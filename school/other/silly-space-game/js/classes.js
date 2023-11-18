import { randFloat, randInt, canvas_centre } from "./tems_library/tems_library.js";
import { settings } from "./tems_library/settings.js";
import { pointDistanceFromPoint, circleOverlapping } from "./tems_library/math.js"
import { global, ctx, inputManager } from "./global.js";

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
    "tiny" : [
        "sprite_meteor_tiny_1",
        "sprite_meteor_tiny_2",
    ]
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
        this.d_rotation = randFloat(-0.004, 0.008)
        
        
        const speed = randFloat(global.circle_speed_offset, global.circle_speed_rand)
        const random_angle = randFloat(0, Math.PI * 2);
        this.velocity = {
            "x": Math.cos(random_angle) * speed,
            "y": Math.sin(random_angle) * speed
        }

        this.position = {
            "x": randInt(this.radius, ctx.canvas.width - 2 * this.radius),
            "y": randInt(this.radius, ctx.canvas.height - 2 * this.radius)
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
        if (this.position["x"] < this.radius + 5) {
            this.drawAtPos(this.position["x"] + ctx.canvas.width, this.position["y"])
        } else if (this.position["x"] > ctx.canvas.width - this.radius - 5) {
            this.drawAtPos(this.position["x"] - ctx.canvas.width, this.position["y"])
        }

        // handle the edges on the y plane
        if (this.position["y"] < this.radius + 5) {
            this.drawAtPos(this.position["x"], this.position["y"] + ctx.canvas.height)
        } else if (this.position["y"] > ctx.canvas.height - this.radius - 5) {
            this.drawAtPos(this.position["x"], this.position["y"] - ctx.canvas.height)
        }

        // draw the circle at the actual position
        this.drawAtPos(this.position["x"], this.position["y"])
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


export class Player {
    constructor() {
        this.size = 50

        const skin = "sprite_player_ship_1_blue"

        this.sprite = global.assets[skin]
        this.colour = global.asset_bonus_data[skin]

        this.mouse_rotation = 0
        this.controller_rotation = 0
        this.radius = 25

        this.shoot_charge_up_time = 0
        this.input = {}

        // how many space ships have been drawn this frame, used for when all 4 possible ships should be rendered
        this.drawn_this_frame = 0

        this.position = {
            "x": ctx.canvas.width/2,
            "y": ctx.canvas.height/2
        }

        this.velocity = {
            "x": 0,
            "y": 0
        }
    }

    drawAtPos(x, y) {
        this.drawn_this_frame += 1
        // transform and rotate the transformation matrix in order to rotate the sprite
        ctx.translate(x, y)
        if ( inputManager.isUsingController ) {
            ctx.rotate(this.controller_rotation)
        } else {
            ctx.rotate(this.updateShipRotationUsingMouse(x, y))
        }
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

        // shooting
        if ( this.input["shooting"] == false && this.shoot_charge_up_time > 10 ) {
            if ( this.shoot_charge_up_time < 45 ) {
                this.shootSmall(x, y)
            }
            else {
                this.shootBig(x, y)
            }
            console.log(`POW! ${this.shoot_charge_up_time}`)
        }
    }

    draw() {
        this.drawn_this_frame = 0
        const offset_value = 20

        // handle the edges on the x plane
        if (this.position["x"] < this.radius + offset_value) {
            this.drawAtPos(this.position["x"] + ctx.canvas.width, this.position["y"])
        } else if (this.position["x"] > ctx.canvas.width - this.radius - offset_value) {
            this.drawAtPos(this.position["x"] - ctx.canvas.width, this.position["y"])
        }

        // handle the edges on the y plane
        if (this.position["y"] < this.radius + offset_value) {
            this.drawAtPos(this.position["x"], this.position["y"] + ctx.canvas.height)
        } else if (this.position["y"] > ctx.canvas.height - this.radius - offset_value) {
            this.drawAtPos(this.position["x"], this.position["y"] - ctx.canvas.height)
        }

        // draw the circle at the actual position
        this.drawAtPos(this.position["x"], this.position["y"])

        // if there's already been 3 players drawn, we need to draw a 4th one as the player is in one of the corners
        // and the code above simply doesn't have the ability to handle corners properly :)
        if ( this.drawn_this_frame == 3 ){
            if ( this.position["x"] > ctx.canvas.width / 2 ) {
                if ( this.position["y"] < ctx.canvas.height / 2 ) {
                    // the real player is at the top right
                    this.drawAtPos(this.position["x"] - ctx.canvas.width, this.position["y"] + ctx.canvas.height)
                } else {
                    // the real player is at the bottom right
                    this.drawAtPos(this.position["x"] - ctx.canvas.width, this.position["y"] - ctx.canvas.height)
                }
            } else {
                if ( this.position["y"] < ctx.canvas.height / 2 ) {
                    // the real player is at the top left
                    this.drawAtPos(this.position["x"] + ctx.canvas.width, this.position["y"] + ctx.canvas.height)
                } else {
                    // the real player is at the bottom left
                    this.drawAtPos(this.position["x"] + ctx.canvas.width, this.position["y"] - ctx.canvas.height)
                }
            }
        }
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

    slideTowards(new_velocity) {
        this.velocity["x"] *= global.player_slipperiness
        this.velocity["y"] *= global.player_slipperiness
        this.velocity["x"] += new_velocity["x"]
        this.velocity["y"] += new_velocity["y"]
        this.velocity["x"] = inputManager.capInput(this.velocity["x"], -global.player_max_speed, global.player_max_speed)
        this.velocity["y"] = inputManager.capInput(this.velocity["y"], -global.player_max_speed, global.player_max_speed)
    }

    // take x and y as arguments so that when drawing this on the edges of the screen it correctly works
    updateShipRotationUsingMouse(x, y) {
        // update the rotation so that the players looks at the mouse
        this.mouse_rotation = Math.PI/2 + Math.atan2(
            inputManager.mouse["y"] - y,
            inputManager.mouse["x"] - x
        )

        return this.mouse_rotation
    }

    updateShipRotationUsingController(x_direction, y_direction) {
        if ( x_direction == 0 && y_direction == 0 ) {
            return this.controller_rotation
        }

        // set the rotation to match the joystick's direction
        this.controller_rotation = Math.PI/2 + Math.atan2(
            y_direction,
            x_direction
        )
        
        return this.controller_rotation
    }

    getInput() {
        var input = {
            "movement" : {
                "x": 0, // movement direction
                "y": 0, // movement direction
            },
            "direction" : {
                "x": 0, // right joystick direction
                "y": 0, // right joystick direction
            },
            "shooting": false
        }

        // handle controller
        inputManager.controllers.forEach(function (controller) {
            // if firefox
            if ( navigator.userAgent.indexOf("Firefox") != -1 ) {
                input["movement"]["x"] += inputManager.getAxes(controller, 6) + inputManager.getAxes(controller, 0)
                input["movement"]["y"] += inputManager.getAxes(controller, 7) + inputManager.getAxes(controller, 1)
                input["direction"]["x"] += inputManager.getAxes(controller, 3),
                input["direction"]["y"] += inputManager.getAxes(controller, 4)
            } // if chromium x_direction
            else if ( window.chrome ) {
                input["movement"]["x"] += inputManager.getButton(controller, 15) - inputManager.getButton(controller, 14) + inputManager.getAxes(controller, 0)
                input["movement"]["y"] += inputManager.getButton(controller, 13) - inputManager.getButton(controller, 12) + inputManager.getAxes(controller, 1)
                input["direction"]["x"] += inputManager.getAxes(controller, 3),
                input["direction"]["y"] += inputManager.getAxes(controller, 4)
            }
        })


        // handle keyboard
        input["movement"]["x"] += inputManager.getKey(["KeyD"]) - inputManager.getKey(["KeyA"])
        input["movement"]["y"] += inputManager.getKey(["KeyS"]) - inputManager.getKey(["KeyW"])
        input["movement"]["x"] += inputManager.getKey(["ArrowRight"]) - inputManager.getKey(["ArrowLeft"])
        input["movement"]["y"] += inputManager.getKey(["ArrowDown"]) - inputManager.getKey(["ArrowUp"])

        if ( inputManager.mouse.leftButton ) { input["shooting"] = true }
        

        
        // normalize the inputs if they're too big
        input["movement"] = inputManager.normalize(input["movement"]["x"], input["movement"]["y"])

        // make sure the value is within -1 to 1, (to avoid people being able to press `w` and `upArrow` at the same time for double speed)
        input["movement"]["x"] = inputManager.capInput(input["movement"]["x"], -1, 1)
        input["movement"]["y"] = inputManager.capInput(input["movement"]["y"], -1, 1)

        // multiply it by the player's acceleration
        input["movement"]["x"] = input["movement"]["x"] * global.player_acceleration
        input["movement"]["y"] = input["movement"]["y"] * global.player_acceleration
        
        return input
    }



    updateIsUsingController() {
        inputManager.controllers.forEach(function (controller) {
            if (
                inputManager.getAxes(controller, 3)
                || inputManager.getAxes(controller, 4)
            ) {
                inputManager.isUsingController = true
            }
        })
    }

    shootSmall(x, y) {
        global.assets["sfx_laser_small"].play()
        global.lasers.push(
            new Laser(
                x, y,
                inputManager.mouse.x, inputManager.mouse.y,
                "#CC4444", 5,
                0.7
            )
        )
    }

    shootBig(x, y) {
        global.assets["sfx_laser_large"].play()
        global.lasers.push(
            new Laser(
                x, y,
                inputManager.mouse.x, inputManager.mouse.y,
                // this.radius * 2 - 8 in the beam width just ensures that the beam's max width is as wide as the player's hit box
                "#FF0030", 8 + Math.min(this.radius * 2 - 8, (this.shoot_charge_up_time-45) / 5),
                // set the decay time to 18 frames
                (8 + Math.min(this.radius * 2 - 8, (this.shoot_charge_up_time-45) / 5)) / 18
            )
        )
    }

    move() {
        this.updateIsUsingController()

        // shooting
        if ( this.input["shooting"] ) { this.shoot_charge_up_time += 1}
        else if ( this.shoot_charge_up_time > 10 ) {
            global.assets["sfx_space_engine_2"].pause()
            // the actual shooting is handled in the drawAtPos() function
            this.shoot_charge_up_time = 0
        }

        if ( this.shoot_charge_up_time == 45 ){
            global.assets["sfx_space_engine_2"].play()
        }

        this.input = this.getInput()

        // movement
        this.slideTowards(this.input["movement"])
        this.updateShipRotationUsingController(this.input["direction"]["x"], this.input["direction"]["y"])
        this.moveTowardsDirection(this.velocity)



        // console.log(this.velocity)

        for (let i = 0; i < global.circles.length; i++) {
            if ( circleOverlapping(this, global.circles[i])) {
                // console.log("death :(")
            }
        }
    }
}

class Laser {
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