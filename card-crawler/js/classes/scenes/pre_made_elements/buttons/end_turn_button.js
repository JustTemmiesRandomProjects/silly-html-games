import { ctx } from "../../../../global.js"
import { Button } from "../../../parents/UI/button.js"

// this is used in the combat segment to end the player's turn
export class EndTurnButton extends Button {
    constructor(parent) {
        super(
            {x: ctx.canvas.width / 8 - 130, y: ctx.canvas.height * 0.65 - 60},
            {x: 260, y: 120}
        )

        this.hover_colour = "#bbcbc0"
        this.standard_colour = "#c6dac9"
        this.text_colour = "#454f45"
        this.font = "kalam-regular"
        this.text = "End Turn"
        this.text_y_offset = 8
        this.font_size = 42

        const self = this
        this.handleUIClick = async function(event) {
            if (self.processing) {
                parent.end_turn()
            }
        }
    }
}