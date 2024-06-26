import { global, ctx, inputManager, backgroundCtx } from "../../global.js"
import { Entity } from "../parents/baseEntity.js";

export class Background extends Entity{
    constructor() {
        super()

        this.zones = [
            {
                "xStart": 0 * ctx.canvas.width, "xEnd": 1/4 * ctx.canvas.width,
                "yStart": 0 * ctx.canvas.height, 'yEnd': 1 * ctx.canvas.height,
                "colour": "#d2e7d6"
            },
            {
                "xStart": 1/4 * ctx.canvas.width, "xEnd": 1 * ctx.canvas.width,
                "yStart": 0 * ctx.canvas.height, 'yEnd': 1 * ctx.canvas.height,
                "colour": "#e0f0e3"
            },
            // {
            //     "xStart": 5/6 * ctx.canvas.width, "xEnd": 1 * ctx.canvas.width,
            //     "yStart": 0 * ctx.canvas.height, 'yEnd': 1 * ctx.canvas.height,
            //     "colour": "#d2e7d6"
            // }
        ]
        
        this.zones.forEach(zone => {
            zone["xStart"] = Math.floor(zone["xStart"])
            zone["yStart"] = Math.floor(zone["yStart"])
            zone["xSize"] = Math.floor(zone["xEnd"] - zone["xStart"])
            zone["ySize"] = Math.floor(zone["yEnd"] - zone["yStart"])
        });
    }

    draw() {
        this.zones.forEach(zone => {
            backgroundCtx.fillStyle = zone["colour"];
            backgroundCtx.fillRect(
                zone["xStart"], zone["yStart"],
                zone["xEnd"] - zone["xStart"], zone["yEnd"] - zone["yStart"]
            );
        });
    }

    tick() {
        this.genericEntityTick()
        
        this.draw()
    }
}