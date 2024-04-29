import { ctx, hudCtx } from "../../../../global.js"
import { Button } from "../../../parents/UI/button.js"

// this is used in the combat segment to end the player's turn
export class SkipCardRewardButton extends Button {
    constructor(pos, size, parent) {
        super(
            pos,
            size
        )

        this.hover_colour = "#bbcbc0"
        this.standard_colour = "#c6dac9"
        this.text_colour = "#454f45"
        this.font = "kalam-regular"
        this.text = "Skip"
        this.text_y_offset = 8
        this.font_size = 42

        const self = this
        this.handleUIClick = async function(event) {
            if (self.processing) {
                parent.closeScreen()
            }
        }
    }

    tick() {
        this.genericEntityTick()
        this.draw(hudCtx)
    }
}