import { global, ctx, inputManager } from "../../global.js"
import { Entity } from "../baseEntity.js";

export class Enemy extends Entity {
    constructor() {
        super()

        this.size = {x:128, y:128}
        this.position = {x:1300, y:200}

        this.HP = 20
        this.sprite = global.assets["sprite_player_idle"]
        this.sprite.setPosition(this.position.x, this.position.y)
        this.sprite.setTicksPerFrame(7)
        this.sprite.setScale(12, 12)
    }

    tick() {
        this.sprite.draw()
    }

    turnStart() {
        console.log("sick i can do things")
        this.drawHand()
    }

    turnEnd() {
        this.discardHand()
    }
}