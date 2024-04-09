import { global, ctx, inputManager } from "../../global.js"
import { drawBezierArrow } from "../../tems_library/rendering.js";
import { call_deferred } from "../../tems_library/tems_library.js";
import { Card } from "./card.js";

export class TargetCard extends Card {
    constructor(colour) {
        super(colour)
    }

    register() {
        super.register()

        const self = this
        // this.handleUIClick = async function(event) {
        //     if (global.player.hovering_card != self) {
        //         if (global.debug_mode) {
        //             console.log(`${self.name} is not being hovered, returning early`)
        //         }
        //         return
        //     }

        //     global.player.target_card = self
        // }
        //     global.player.play_queue.push(card)
        //     global.player.hand = global.player.hand.filter((local_card) => local_card != self)

        //     console.log(`playing "${self.name}"...`)

        //     ctx.canvas.removeEventListener("click", self.handleUIClick)
    }

    tick() {
        if (this.processing) {
            if (global.player.hovering_card == this) {
                this.miliseconds_hovered += global.delta_time * 2
                call_deferred(this, "draw")
                
            } else {
                this.miliseconds_hovered = Math.max(0, this.miliseconds_hovered - global.delta_time)
                this.draw()
            }
        }
    }

    draw() {
        super.draw()

        if (global.player.target_card == this) {
            this.renderArrow()
        }
    }

    renderArrow() {
        drawBezierArrow(ctx, 
            {x: this.position.x + this.size.x / 2, y: this.position.y + this.size.y / 2},
            inputManager.mouse)
    }
}