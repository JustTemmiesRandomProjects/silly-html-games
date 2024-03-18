import { randFloat, randInt, canvas_centre, drawWithScreenWrap } from "../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../global.js"

export class Player {
    constructor() {
        this.ID = global.entity_counter
        global.entity_counter ++

        this.sprite = global.assets["sprite_player_active"].newClone()
        this.sprite.setPosition(0, 0)
        this.sprite.setTicksPerFrame(10)
        this.sprite.setScale(3)
        
        this.size = 50
        this.input = {}
        
        this.position = {
            "x": ctx.canvas.width/12,
            "y": ctx.canvas.height/2
        }

        this.velocity = {
            "x": 0,
            "y": 0
        }
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
            }
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

        
        // normalize the inputs if they're too big
        input["movement"] = inputManager.normalize(input["movement"]["x"], input["movement"]["y"])

        // make sure the value is within -1 to 1, (to avoid people being able to press `w` and `upArrow` at the same time for double speed)
        input["movement"]["x"] = inputManager.capInput(input["movement"]["x"], -1, 1)
        input["movement"]["y"] = inputManager.capInput(input["movement"]["y"], -1, 1)

        // multiply it by the player's acceleration
        input["movement"]["x"] = input["movement"]["x"] * global.player_acceleration
        input["movement"]["y"] = input["movement"]["y"] * global.player_acceleration



        return input;
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

    // direction is an array
    moveTowardsDirection(direction) {
        this.position["x"] += direction["x"]
        this.position["y"] += direction["y"]
        if (this.position["x"] < 0) {
            this.position["x"] = 0
        } else if (this.position["x"] > ctx.canvas.width) {
            this.position["x"] = ctx.canvas.width 
        }

        if (this.position["y"] < 0) {
            this.position["y"] = 0
        } else if (this.position["y"] > ctx.canvas.height) {
            this.position["y"] = ctx.canvas.height
        }
    }
    

    draw() {
        this.sprite.setPosition(this.position["x"], this.position["y"])
        this.sprite.draw()
    }

    tick() {
        // this.updateIsUsingController()

        this.input = this.getInput();
        this.slideTowards(this.input["movement"])
        this.moveTowardsDirection(this.velocity)

        this.draw()
    }
}