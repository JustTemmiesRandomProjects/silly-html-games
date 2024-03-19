import { ctx } from "../../global.js";
import { UIElement } from "../parents/UI_element.js";

export class Button extends UIElement {
    constructor(position, size) {
        super(position, size)

        this.hover_colour = this.colour
        this.standard_colour = this.colour
        this.text_colour = "ff4400"
        this.text = ""
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
        ctx.font = "20px Arial";
        ctx.fillText(text, this.position["x"] + 10, this.position["y"] + 30);
    }

    tick() {
        if (this.visible) {
            this.draw()
        }
    }
}

