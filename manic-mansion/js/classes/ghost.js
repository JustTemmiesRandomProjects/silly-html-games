import { randFloat, randInt, canvas_centre, drawWithScreenWrap } from "../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../global.js"

export class Ghost {
    constructor() {
        this.ID = global.entity_counter
        global.entity_counter ++

        this.sprite = global.assets["sprite_ghost"].newClone()
        this.sprite.setPosition(0, 0)
        this.sprite.setTicksPerFrame(10)
        this.sprite.setScale(3)
        
        this.size = 50
        this.input = {}
        
        this.position = {
            "x": ctx.canvas.width/2,
            "y": ctx.canvas.height/2
        }

        this.velocity = {
            "x": 0,
            "y": 0
        }
    }

    getInput() {
        let distance = Infinity
        let direction = {}
        global.entities["players"].forEach((player) => {
            let x_delta = this.position["x"] - player.position["x"]
            let y_delta = this.position["y"] - player.position["y"]
            let local_distance = Math.sqrt(
                Math.pow(x_delta, 2)
                + Math.pow(y_delta, 2)
            )
            
            if ( local_distance < distance ) {
                distance = local_distance
                direction = {
                    "x": - x_delta,
                    "y": - y_delta
                }
            }
        })

        direction = inputManager.normalize(direction["x"], direction["y"])
        return direction
    }

    // slideTowards is my movement function, it uses ghost_slipperiness as inverse friction 
    slideTowards(new_velocity) {
        this.velocity["x"] *= global.ghost_slipperiness
        this.velocity["y"] *= global.ghost_slipperiness
        this.velocity["x"] += new_velocity["x"]
        this.velocity["y"] += new_velocity["y"]
        this.velocity["x"] = inputManager.capInput(this.velocity["x"], -global.ghost_max_speed, global.ghost_max_speed)
        this.velocity["y"] = inputManager.capInput(this.velocity["y"], -global.ghost_max_speed, global.ghost_max_speed)
    }

    // direction is an array
    moveTowardsDirection(direction) {
        this.position["x"] += direction["x"]
        this.position["y"] += direction["y"]
    }

    draw() {
        this.sprite.setPosition(this.position["x"], this.position["y"])
        this.sprite.draw()
    }

    tick() {
        this.slideTowards(
            this.getInput()
        )
        this.moveTowardsDirection(this.velocity)

        this.draw()
    }
}