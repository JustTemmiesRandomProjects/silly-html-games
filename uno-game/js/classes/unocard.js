import { randFloat, randInt, canvas_centre, drawWithScreenWrap } from "../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../global.js"

export class UnoCard {
    constructor(colour, number) {
        this.ID = global.entity_counter
        global.entity_counter ++

        this.colour = colour;
        this.number = number;
        
        this.visible = false
        this.glowing = false;
        
        this.position = {
            "x": ctx.canvas.width/2,
            "y": ctx.canvas.height/2
        }

        this.size = {
            "x": 100,
            "y": 150
        }
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
        if (this.glowing) {
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