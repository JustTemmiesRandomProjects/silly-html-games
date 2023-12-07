import { global, ctx } from "../global.js"
import { settings } from "../tems_library/settings.js"
import { randFloat, randInt } from "../tems_library/tems_library.js"


export class Coin {
    constructor(x, y) {
        this.sprite = global.assets["sprite_space_coin"].newClone()
        this.sprite.setPosition(x, y)
        this.sprite.setTicksPerFrame(7)

        this.ID = global.entity_counter
        global.entity_counter ++
        
        this.position = this.sprite.position
        this.radius = global.coin_radius
        this.picked_up = false
    }

    draw() {
        this.sprite.draw()

        if ( settings.show_hitboxes ) {
            ctx.beginPath()
            ctx.arc(this.position["x"], this.position["y"], this.radius, 0, 2 * Math.PI)
            ctx.fillStyle = "#40905050"
            ctx.fill()
        }
    }
}