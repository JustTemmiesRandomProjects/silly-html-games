import { randInt } from "../my_library/my_library.js";
import { global, ctx } from "../global.js";

export class Target {
    constructor() {
        this.ID = global.entity_counter;
        global.entity_counter++;

        this.radius = 20;
        this.colour = "#ee2222";

        this.position = {
            x: (ctx.canvas.width / 16) * 15,
            y: randInt(this.radius, ctx.canvas.height - this.radius * 2),
        };
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.colour;
        ctx.fill();
    }

    tick() {
        this.draw();
    }
}
