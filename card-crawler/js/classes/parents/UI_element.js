import { ctx, global, inputManager } from "../../global.js";
import { Entity } from "./baseEntity.js";

export class UIElement extends Entity {
    constructor(position, size) {
        super()

        this.position = position
        this.size = size

        this.rotation = 0

        this.hovering = false;
        this.colour = "#8f8f8f"
        this.processing = true


        ctx.canvas.addEventListener("mousemove", (e) => {
            if (this.processing) {
                const rect = ctx.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const local_mouseX = mouseX - this.position.x
                const local_mouseY = mouseY - this.position.y
    
                const local_rotated_mouseX = local_mouseX * Math.cos(-this.rotation) - local_mouseY * Math.sin(-this.rotation)
                const local_rotated_mouseY = local_mouseY * Math.cos(-this.rotation) - local_mouseX * Math.sin(-this.rotation)

                if (local_rotated_mouseX >= 0
                && local_rotated_mouseY >= 0
                && local_rotated_mouseX <= this.size.x
                && local_rotated_mouseY <= this.size.y) {
                    this.UIEnter()
                } else {
                    this.UIExit()
                }
            }
        });
    } 

    UIEnter() {
        this.hovering = true
        ctx.canvas.addEventListener("click", this.handleUIClick)
    }

    UIExit() {
        this.hovering = false
        ctx.canvas.removeEventListener("click", this.handleUIClick)
    }

    // just a debug message
    handleUIClick(e) {
        console.log(`clicked, no code set to event ${e}\n     create a function named "handleUIClick" in this class`)
    }
}

