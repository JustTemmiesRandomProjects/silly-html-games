import { global, ctx } from "../global.js";
import { circleOverlapping } from "../my_library/math.js";
import { restart_game } from "../index.js";

export class Projectile {
    constructor(x, y, tarX, tarY, shooting_strength) {
        this.ID = global.entity_counter;
        global.entity_counter++;

        this.radius = 4;
        this.colour = "#22ee22";
        this.gravity = 0.004;

        this.position = {
            x: x,
            y: y,
        };

        this.velocity = {
            x: ((tarX - x) / 2000) * shooting_strength,
            y: ((tarY - y) / 2000) * shooting_strength,
        };
    }

    handleMovement() {
        this.position["x"] += this.velocity["x"];
        this.position["y"] += this.velocity["y"];
        this.velocity["y"] += this.gravity;
    }

    handleCollisions() {
        if (circleOverlapping(this, global.entities["targets"][0])) {
            restart_game();
        }

        const x = this.position["x"];
        const y = this.position["y"];
        for (let i = 0; i < global.entities["squares"].length; i++) {
            const square = global.entities["squares"][i];
            if (x + this.radius > square.position["x"] && x - this.radius < square.position["x"] + square.size["x"]) {
                if (
                    y + this.radius > square.position["y"] &&
                    y - this.radius < square.position["y"] + square.size["y"]
                ) {
                    global.entities["projectiles"] = global.entities["projectiles"].filter(
                        (projectile) => projectile.ID != this.ID
                    );
                }
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.colour;
        ctx.fill();
    }

    tick() {
        this.draw();
        for (let i = 0; i < 5; i++) {
            this.handleMovement();
            this.handleCollisions();
        }
    }
}
