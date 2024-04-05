import { ctx } from "../../../global.js";
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

        if (this.hovering) {
            ctx.fillStyle = "#102f10"
            ctx.fillRect(-2, -2, this.size.x+4, this.size.y+4);
            ctx.fillStyle = this.hover_colour;
        } else {
            ctx.fillStyle = this.standard_colour;
        }
        ctx.fillRect(
            0, 0,
            this.size.x, this.size.y
        );

        ctx.fillStyle = this.text_colour;

        ctx.font = `${this.font_size}px ${this.font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
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

