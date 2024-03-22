import { ctx } from "../../global.js";
import { UIElement } from "./UI_element.js";

export class Button extends UIElement {
    constructor(position, size) {
        super(position, size)

        this.hover_colour = this.colour
        this.standard_colour = this.colour
        this.text_colour = "#ff4400"
        this.text = "bah gah"
        this.font_size = 12
    }

    draw() {
        if (this.hovering) {
            ctx.fillStyle = this.hover_colour;
        } else {
            ctx.fillStyle = this.standard_colour;
        }
        ctx.fillRect(
            this.position.x, this.position.y,
            this.size.x, this.size.y
        );

        ctx.fillStyle = this.text_colour;

        ctx.font = `${this.font_size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            this.text,
            this.position.x + (this.size.x / 2),
            this.position.y + (this.size.y / 2),
        );
    }

    tick() {
        this.draw()
    }
}

