import { global, ctx, inputManager, focusingCardCtx } from "../../global.js"
import { drawBezierArrow } from "../../tems_library/rendering.js";
import { call_deferred } from "../../tems_library/tems_library.js";
import { Card } from "./card.js";

export class TargetCard extends Card {
    constructor(colour) {
        super(colour)

        this.targeting_enemy = null
    }

    register() {
        super.register()
    }

    tick() {
        if (this.processing) {
            super.tick()
            if (this.position.y < ctx.canvas.height * 0.7
                && global.player.focused_card_state != null) {
                this.cleanDragingCard()
                global.player.focused_card_state = "targeting"
                global.player.focused_card = this
            }
        }
    }

    draw() {
        super.draw()
    }
}