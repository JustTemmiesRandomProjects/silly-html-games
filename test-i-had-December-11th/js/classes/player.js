import { global, ctx, inputManager } from "../global.js";
import { Projectile } from "./projectile.js";

export class Player {
    constructor() {
        this.ID = global.entity_counter;
        global.entity_counter++;

        this.radius = 20;
        this.colour = "#ffffff";

        this.shot_last_frame = false;

        // between 2 and 16
        this.shooting_strength = 8;

        this.position = {
            x: ctx.canvas.width / 16,
            y: ctx.canvas.height / 2,
        };
    }

    getInput() {
        var input = {
            shooting_strength: 0, // strength of shot direction
            movement: 0, // movement y direction
            shooting: false,
            target: {
                x: null,
                y: null,
            },
        };

        input["shooting_strength"] += inputManager.getKey(["KeyD"]) - inputManager.getKey(["KeyA"]);
        input["movement"] += inputManager.getKey(["KeyS"]) - inputManager.getKey(["KeyW"]);

        input["target"]["x"] = inputManager.mouse.x;
        input["target"]["y"] = inputManager.mouse.y;

        if (inputManager.mouse.leftButton) {
            input["shooting"] = true;
        }

        return input;
    }

    handleMovement(input) {
        this.position["y"] += input["movement"] * 12;
        this.position["y"] = Math.min(this.position["y"] + this.radius, ctx.canvas.height);
        this.position["y"] = Math.max(this.position["y"] - this.radius, this.radius);
    }

    handleShooting(input) {
        this.shooting_strength += input["shooting_strength"] / 10;
        this.shooting_strength = Math.min(16, this.shooting_strength);
        this.shooting_strength = Math.max(2, this.shooting_strength);

        if (!input["shooting"]) {
            this.shot_last_frame = false;
        }

        if (this.shot_last_frame) {
            return;
        }

        if (input["shooting"]) {
            global.entities["projectiles"].push(
                new Projectile(
                    this.position["x"],
                    this.position["y"],
                    input["target"]["x"],
                    input["target"]["y"],
                    this.shooting_strength
                )
            );
            this.shot_last_frame = true;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.colour;
        ctx.fill();
    }

    tick() {
        const input = this.getInput();
        this.handleMovement(input);
        this.handleShooting(input);

        this.draw();
    }
}
