import { ctx, hudCtx } from "../../../../global.js"
import { setRoomType } from "../../../../managers/room_manager.js"
import { Button } from "../../../parents/UI/button.js"

// this is used in the combat segment to end the player's turn
export class ProceedButton extends Button {
    constructor() {
        super(
            {x: ctx.canvas.width / 8 - 130, y: ctx.canvas.height * 0.65 - 60},
            {x: 260, y: 120}
        )

        this.hover_colour = "#bbcbc0"
        this.standard_colour = "#c6dac9"
        this.text_colour = "#454f45"
        this.font = "kalam-regular"
        this.text = "Proceed"
        this.text_y_offset = 8
        this.font_size = 42
        this.processing = true

        const self = this
        this.handleUIClick = async function(event) {
            if (self.processing == true) {
                console.log("proceeding, starting new combat")
                setRoomType("combat")
                self.UIExit()
                self.processing = false
            }
        }
    }

    tick() {
        this.genericEntityTick()
        this.draw(hudCtx)
    }
}