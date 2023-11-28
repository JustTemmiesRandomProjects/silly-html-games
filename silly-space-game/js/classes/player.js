import { randFloat, randInt, canvas_centre, drawWithScreenWrap } from "../tems_library/tems_library.js"
import { settings } from "../tems_library/settings.js"
import { circleOverlapping } from "../tems_library/math.js"
import { global, ctx, inputManager } from "../global.js"
import { Laser } from "./lasers.js"

function reset_stuff_done_this_tick () {
    return {
        "has_shot": false
    }
}
export class Player {
    constructor() {
        this.size = 50
        this.ID = global.entity_counter
        global.entity_counter ++

        const skin = "sprite_player_ship_1_blue"

        this.sprite = global.assets[skin]
        this.colour = global.asset_bonus_data[skin]

        this.mouse_rotation = 0
        this.controller_rotation = 0
        this.radius = 25

        this.time_since_last_shot = 0
        this.shoot_charge_up_time = 0
        this.input = {}

        this.stuff_done_this_tick = reset_stuff_done_this_tick()

        this.shield_health = 100
        this.shield_regen_cooldown = 0
        this.shield_sprite = global.assets["sprite_player_shield_blue"]

        this.position = {
            "x": ctx.canvas.width/2,
            "y": ctx.canvas.height/2
        }

        this.velocity = {
            "x": 0,
            "y": 0
        }
    }

    // self is used instead as this function is called from outside the class, and i simply can't pass in this
    // tl;dr self = this
    drawAtPos(x, y, self) {
        // transform and rotate the transformation matrix in order to rotate the sprite
        ctx.translate(x, y)
        if ( inputManager.isUsingController ) {
            ctx.rotate(self.controller_rotation)
        } else {
            ctx.rotate(self.updateShipRotationUsingMouse(x, y))
        }
        ctx.translate(-self.sprite.width/2, -self.sprite.height/2)
        ctx.drawImage(self.sprite, 0, 0)
        // reset the tranformation back to the default
        ctx.setTransform(1, 0, 0, 1, 0, 0)

        
        // if this setting in enabled, draw the hitbox
        if ( settings.show_hitboxes ) {
            ctx.beginPath()
            ctx.arc(x, y, self.radius, 0, 2 * Math.PI)
            ctx.fillStyle = self.colour
            ctx.fill()
        }

        // draw the shield
        if ( self.shield_health > 0 ) {
            ctx.beginPath()
            ctx.arc(x, y, self.radius * 2.6, 0, 2 * Math.PI)
            // make the shield flicker a bit if it's under 28% health
            if ( self.shield_health > 28 ) {
                ctx.fillStyle = `#5f78ef${Math.floor(self.shield_health * 1.5).toString(16)}`
            } else if ( global.frames_processed % (32 - Math.floor(self.shield_health)) == 0 ) { // flicker logic
                ctx.fillStyle = `#5f78ef1f`
            } else {
                ctx.fillStyle = "#00000000" // fully transparent
            }
            ctx.fill()
        }


        // shooting
        if ( self.input["shooting"] == false && self.shoot_charge_up_time >= 1 && self.time_since_last_shot >= 10) {
            if ( self.shoot_charge_up_time < 45 ) {
                self.shootSmall(x, y)
            }
            else {
                self.shootBig(x, y)
            }
        }
    }

    draw() {
        drawWithScreenWrap(
            this.position["x"], this.position["y"], this.radius,
            this.drawAtPos, 40, this
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

    // slideTowards is my movement function, it uses player_slipperiness as inverse friction 
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
                "x": 0, // movement x direction
                "y": 0, // movement y direction
            },
            "direction" : {
                "x": 0, // right joystick x direction
                "y": 0, // right joystick y direction
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
        if ( this.stuff_done_this_tick["has_shot"] == false ) {
            global.assets["sfx_laser_small"].play_unique()
            this.stuff_done_this_tick["has_shot"] = true
        }
        global.lasers.push(
            new Laser(
                x, y,
                inputManager.mouse.x, inputManager.mouse.y,
                "#CC4444", 6,
                0.65
            )
        )
    }

    shootBig(x, y) {
        if ( this.stuff_done_this_tick["has_shot"] == false ) {
            const lasers_to_play = Math.min(3, Math.ceil((this.shoot_charge_up_time-45) / 50))
            for (let i = 0; i < lasers_to_play; i++) {
                global.assets["sfx_laser_large"].play_unique()
            }
            this.stuff_done_this_tick["has_shot"] = true
        }
        global.lasers.push(
            new Laser(
                x, y,
                inputManager.mouse.x, inputManager.mouse.y,
                "#FF0030", 8 + Math.min(this.radius * 2, (this.shoot_charge_up_time-40) / 3),
                // set the decay time to 28 frames
                (8 + Math.min(this.radius * 2 - 8, (this.shoot_charge_up_time-45) / 5)) / 28
            )
        )
    }

    tick() {
        // stuff to just run every tick
        this.stuff_done_this_tick = reset_stuff_done_this_tick()
        this.updateIsUsingController()

        // regen shield
        if ( this.shield_regen_cooldown > 0) {
            this.shield_regen_cooldown -= 1
        } else if ( this.shield_health < 100 ) {
            this.shield_health += 0.025
        }
        
        // shooting
        if ( this.input["shooting"] ) { this.shoot_charge_up_time += 1}
        else if ( this.time_since_last_shot >= 10 && this.shoot_charge_up_time > 1) {
            global.assets["sfx_space_engine_2"].stop()
            // the actual shooting is handled in the drawAtPos() function
            // this is done so that each ship will shoot independently of eachother
            // so that if the player is "between" two sides of the map, they will shoot from "both ships"
            global.players_last_shot_laser_power = this.shoot_charge_up_time
            this.shoot_charge_up_time = 0
            this.time_since_last_shot = 0
        }

        if ( this.shoot_charge_up_time == 45 ){
            global.assets["sfx_space_engine_2"].play()
        }

        this.time_since_last_shot += 1

        // get player input
        this.input = this.getInput()

        // movement
        this.slideTowards(this.input["movement"])
        this.updateShipRotationUsingController(this.input["direction"]["x"], this.input["direction"]["y"])
        this.moveTowardsDirection(this.velocity)
        
        
        for (let i = 0; i < global.circles.length; i++) {
            if ( circleOverlapping(this, global.circles[i])) {
                // console.log("death :(")
            }
        }
    }
}