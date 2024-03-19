import { ctx } from "../../global.js";
import { Entity } from "../baseEntity.js";

export class UIElement extends Entity {
    constructor(position, size) {
        super()

        this.visible = true;
        this.hovering = false;
        this.colour = "#8f8f8f"

        this.position = position
        this.size = size

        ctx.canvas.addEventListener('mousemove', (event) => {
            const rect = ctx.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            if (mouseX >= this.position["x"]
            && mouseY >= this.position["y"]
            && mouseX <= this.position["x"] + this.size["x"]
            && mouseY <= this.position["y"] + this.size["y"]) {
                this.UIEnter()
            } else {
                this.UIExit()
            }
        });
    } 

    UIEnter() {
        this.hovering = true
    }

    UIExit() {
        this.hovering = false
    }
}

