import { Button } from "../../../parents/UI/button.js"

// this is used in the combat segment to end the player's turn
export class EndTurnButton extends Button {
    constructor(self) {
        super(
            {x: 60, y: 560},
            {x: 200, y: 80}
        )

        this.hover_colour = "#bbcbc0"
        this.standard_colour = "#c6dac9"
        this.text_colour = "#454f45"
        this.font = "kalam-regular"
        this.text = "End Turn"
        this.font_size = 28

        this.handleUIClick = async function(event) {
            self.end_turn()
        }
    }
}