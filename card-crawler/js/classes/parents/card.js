import { randFloat, randInt, canvas_centre, drawWithScreenWrap } from "../../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../../global.js"
import { UIElement } from "./UI_element.js";

export class Card extends UIElement {
    constructor(colour, number) {
        super(
            {x: ctx.canvas.width/2, y: ctx.canvas.height/2},
            {x: 150, y: 100}
        )
        
        this.colour = colour;
        this.number = number;
        
        this.hovering = false;
    }

    isMouseOver(mouseX, mouseY) {
        return mouseX >= this.position["x"]
        && mouseY >= this.position["y"]
        && mouseX <= this.position["x"] + this.size["x"]
        && mouseY <= this.position["y"] + this.size["y"];
    }

    draw(x, y) {
        // Background
        ctx.fillStyle = "white";
        ctx.fillRect(this.position["x"], this.position["y"], this.size["x"], this.size["y"]);

        // Border
        if (this.hovering) {
            ctx.strokeStyle = "orange"
        } else {
            ctx.strokeStyle = "black";
        }
        ctx.strokeRect(this.position["x"], this.position["y"], this.size["x"], this.size["y"]);

        // Text
        ctx.fillStyle = this.colour;
        ctx.font = "20px Arial";
        ctx.fillText(this.number, this.position["x"] + 10, this.position["y"] + 30);
    }

    tick() {
        if (this.visible) {
            this.draw()
        }
    }
}