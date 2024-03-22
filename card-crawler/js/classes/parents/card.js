import { randFloat, randInt, canvas_centre, drawWithScreenWrap } from "../../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../../global.js"
import { UIElement } from "./UI_element.js";

export class Card extends UIElement {
    constructor(colour, number) {
        super(
            {x: ctx.canvas.width/2, y: ctx.canvas.height/2},
            {x: 150, y: 220}
        )
        
        this.colour = colour;
        this.number = number;
        
        this.hovering = false;
        this.font_size = 64

        this.handleUIClick = async function(event) {
            console.log(colour)
        }
    }

    draw(x, y) {
        // Border
        if (this.hovering) {
            ctx.fillStyle = "#efcf8f"
            ctx.fillRect(this.position["x"]-3, this.position["y"]-3, this.size["x"]+6, this.size["y"]+6);
        }

        // Background
        ctx.fillStyle = "white";
        ctx.fillRect(this.position["x"], this.position["y"], this.size["x"], this.size["y"]);

        // Text
        ctx.fillStyle = this.colour;
        ctx.font = `${this.font_size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            this.number,
            this.position.x + (this.size.x / 2),
            this.position.y + (this.size.y / 2),
        );
    }

    tick() {
        if (this.processing) {
            this.draw()
        }
    }
}