import { randInt, rgbToHex } from "../my_library/my_library.js";
import { global, ctx } from "../global.js";

export class Square {
    constructor() {
        this.ID = global.entity_counter;
        global.entity_counter++;

        this.colour = rgbToHex([randInt(70, 100), randInt(0, 80), randInt(180, 75), 255]);

        this.size = {
            x: 70,
            y: 70,
        };

        this.position = {
            x: randInt(ctx.canvas.width / 4, ctx.canvas.width / 2 - this.size["x"]),
            y: randInt(0, ctx.canvas.height - this.size["y"]),
        };
    }

    draw() {
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.position["x"], this.position["y"], this.size["x"], this.size["y"]);
    }

    // called every frame
    tick() {
        this.draw();
    }
}
