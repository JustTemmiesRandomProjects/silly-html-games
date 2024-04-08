import { ctx } from "../../../global.js";
import { drawSquircle } from "../../../tems_library/tems_library.js";
import { UIElement } from "../UI_element.js";

export class Button extends UIElement {
    constructor(position, size) {
        super(position, size)

        this.hover_colour = this.colour
        this.standard_colour = this.colour

        this.text_colour = "#454f45"

        this.font = "kalam-regular"
        this.text = "bah gah"
        this.text_y_offset = 0
        this.text_x_offset = 0
        this.font_size = 12
    }

    draw() {
        ctx.translate(this.position.x, this.position.y)

        let fill_colour = this.standard_colour
        if (this.hovering) {
            drawSquircle(ctx, -2, -2, this.size.x + 4, this.size.y + 4, 14, "#102f10")
            fill_colour = this.hover_colour;
        }

        drawSquircle(ctx, 0, 0, this.size.x, this.size.y, 12, fill_colour)

        
        ctx.font = `${this.font_size}px ${this.font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.text_colour;
        ctx.fillText(
            this.text,
            this.size.x / 2 + this.text_x_offset,
            this.size.y / 2 + this.text_y_offset,
        );

        ctx.setTransform(1, 0, 0, 1, 0, 0)
    }

    tick() {
        this.draw()
    }
}

