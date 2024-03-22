import { ctx } from "../../global.js";
import { Entity } from "../baseEntity.js";

export class UIElement extends Entity {
    constructor(position, size) {
        super()

        this.position = position
        this.size = size

        this.hovering = false;
        this.colour = "#8f8f8f"
        this.processing = true


        ctx.canvas.addEventListener("mousemove", (e) => {
            if (this.processing) {
                const rect = ctx.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
    
                if (mouseX >= this.position.x
                && mouseY >= this.position.y
                && mouseX <= this.position.x + this.size.x
                && mouseY <= this.position.y + this.size.y) {
                    this.UIEnter()
                    ctx.canvas.addEventListener("click", this.handleUIClick)
                } else {
                    this.UIExit()
                    ctx.canvas.removeEventListener("click", this.handleUIClick)
                }
            }
        });
    } 

    UIEnter() {
        this.hovering = true
    }

    UIExit() {
        this.hovering = false
    }

    // just a debug message
    handleUIClick(e) {
        console.log(`clicked, no code set to event ${e}\n     create a function named "handleUIClick" in this class`)
    }
}

