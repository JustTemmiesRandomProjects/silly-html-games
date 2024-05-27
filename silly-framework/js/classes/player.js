import { randFloat, randInt, canvas_centre, drawWithScreenWrap, accountForDisplay } from "../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../global.js"

export class Player {
    constructor() {
        this.ID = global.entity_counter
        global.entity_counter ++

        this.radius = 20
        this.player_acceleration = accountForDisplay(0.8)
        this.player_max_speed = accountForDisplay(10)
        this.player_slipperiness = 0.97

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
    // tl;dr self is just a local representation of the player object
    drawAtPos(x, y, self) {
        ctx.beginPath()
        ctx.arc(x, y, self.radius, 0, 2 * Math.PI)
        ctx.fillStyle = "#666666"
        ctx.fill()
    }

    draw() {
        drawWithScreenWrap(
            this.position["x"], this.position["y"], this.radius,
            this.drawAtPos, 40, this
        )
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

    getInput() {
        var input = {
            "movement" : {
                "x": 0, // movement x direction
                "y": 0, // movement y direction
            }
        }

        // handle controller
        inputManager.controllers.forEach((controller) => {
            // if chromium 
            if ( window.chrome ) {
                input["movement"]["x"] += inputManager.getButton(controller, 15) - inputManager.getButton(controller, 14) + inputManager.getAxes(controller, 0)
                input["movement"]["y"] += inputManager.getButton(controller, 13) - inputManager.getButton(controller, 12) + inputManager.getAxes(controller, 1)
            }
            // if firefox
            if ( navigator.userAgent.indexOf("Firefox") != -1 ) {
                input["movement"]["x"] += inputManager.getAxes(controller, 6) + inputManager.getAxes(controller, 0)
                input["movement"]["y"] += inputManager.getAxes(controller, 7) + inputManager.getAxes(controller, 1)
            }
        })


        // handle keyboard
        input["movement"]["x"] += inputManager.getKey(["KeyD"]) - inputManager.getKey(["KeyA"])
        input["movement"]["y"] += inputManager.getKey(["KeyS"]) - inputManager.getKey(["KeyW"])
        input["movement"]["x"] += inputManager.getKey(["ArrowRight"]) - inputManager.getKey(["ArrowLeft"])
        input["movement"]["y"] += inputManager.getKey(["ArrowDown"]) - inputManager.getKey(["ArrowUp"])

        // normalize the movement
        input["movement"] = inputManager.normalize(input["movement"]["x"], input["movement"]["y"])

        // multiply it by the player's acceleration
        input["movement"]["x"] = input["movement"]["x"] * this.player_acceleration
        input["movement"]["y"] = input["movement"]["y"] * this.player_acceleration
        
        return input
    }

    // uses player_slipperiness as inverse friction 
    updateVelocity(new_velocity) {
        this.velocity["x"] *= this.player_slipperiness
        this.velocity["y"] *= this.player_slipperiness
        this.velocity["x"] += new_velocity["x"]
        this.velocity["y"] += new_velocity["y"]
        this.velocity["x"] = inputManager.capInput(this.velocity["x"], -this.player_max_speed, this.player_max_speed)
        this.velocity["y"] = inputManager.capInput(this.velocity["y"], -this.player_max_speed, this.player_max_speed)
    }

    // use the player's velocity to slide, with screen wrap
    moveAndSlide() {
        this.position["x"] += this.velocity["x"]
        this.position["y"] += this.velocity["y"]

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


    tick() {
        this.updateIsUsingController()
        
        let input = this.getInput()
        this.updateVelocity(input["movement"])
        this.moveAndSlide()

        this.draw()
    }
}