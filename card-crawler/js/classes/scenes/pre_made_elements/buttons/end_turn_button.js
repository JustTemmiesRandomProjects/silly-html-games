import { Button } from "../../../parents/button.js"

// this is used in the combat segment to end the player's turn
export class EndTurnButton extends Button {
    constructor(self) {
        super(
            {x: 60, y: 560},
            {x: 200, y: 80}
        )

        this.hover_colour = "#4e4e4e"
        this.standard_colour = "#404040"
        this.text_colour = "#d8d8d8"
        this.text = "End Turn"
        this.font_size = 28

        this.handleUIClick = async function(event) {
            self.end_turn()
        }
    }
}