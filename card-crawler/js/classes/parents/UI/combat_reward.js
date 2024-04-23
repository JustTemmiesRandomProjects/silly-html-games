import { ctx, hudCtx } from "../../../global.js";
import { drawSquircle } from "../../../tems_library/rendering.js";
import { UIElement } from "../UI_element.js";
import { Button } from "./button.js";

export class CombatReward extends Button {
    constructor(position, size, ctx) {
        super(position, size)

        this.ctx = ctx

        this.hover_colour = "#bbcbc0"
        this.standard_colour = "#4f584f"
        this.text_colour = "#dfe8df"

        this.font = "kalam-bold"
        this.text_y_offset = 8
        this.font_size = 32

        this.rewards = []

        const self = this
        this.handleUIClick = function () {
            console.log(`clicked! ${self.text}`)
        }
    }

    draw() {
        this.ctx.translate(this.position.x, this.position.y)

        let fill_colour = this.standard_colour
        if (this.hovering) {
            fill_colour = this.hover_colour;
        }

        drawSquircle(this.ctx, 0, 0, this.size.x, this.size.y, 12, fill_colour)

        
        this.ctx.font = `${this.font_size}px ${this.font}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = this.text_colour;
        this.ctx.fillText(
            this.text,
            this.size.x / 2 + this.text_x_offset,
            this.size.y / 2 + this.text_y_offset,
        );

        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    }

    tick() {
        this.draw()
    }
}

