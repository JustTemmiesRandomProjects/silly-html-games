import { randFloat, randInt, canvas_centre, drawWithScreenWrap } from "../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../global.js"

export class Player {
    constructor() {
        this.ID = global.entity_counter
        global.entity_counter ++

        self.radius = 20

        this.position = {
            "x": ctx.canvas.width/2,
            "y": ctx.canvas.height/2
        }

        this.velocity = {
            "x": 0,
            "y": 0
        }
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, self.radius, 0, 2 * Math.PI)
        ctx.fillStyle = "#666666"
        ctx.fill()
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

    tick() {
        this.updateIsUsingController()
        this.draw()
    }
}