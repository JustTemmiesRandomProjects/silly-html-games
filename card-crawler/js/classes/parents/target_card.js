import { global, ctx, inputManager } from "../../global.js"
import { drawBezierArrow } from "../../tems_library/rendering.js";
import { call_deferred } from "../../tems_library/tems_library.js";
import { Card } from "./card.js";

export class TargetCard extends Card {
    constructor(colour) {
        super(colour)
    }

    tick() {
        if (this.processing) {
            if (global.player.hovering == this) {
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

        if (global.player.hovering == this) {
            this.renderArrow()
        }
    }

    renderArrow() {
        drawBezierArrow(ctx, 
            {x: this.position.x + this.size.x / 2, y: this.position.y + this.size.y / 2},
            inputManager.mouse)
    }
}