import { global, ctx, inputManager } from "../../global.js"
import { drawSquircle, randInt } from "../../tems_library/tems_library.js";
import { Entity } from "../parents/baseEntity.js";

export class Enemy extends Entity {
    constructor() {
        super()

        this.position = {x:1300, y:200}

        this.MAX_HP = 184
        this.HP = this.MAX_HP
        this.sprite = global.assets["beaver"]
        this.sprite.setPosition(this.position.x, this.position.y)
        this.sprite.setSize(256, 256)
    }

    tick() {
        this.HP -= 0.1
        this.sprite.draw()
        this.drawHealthBar()
    }

    drawHealthBar() {
        const x_offset_value = this.sprite.size.x * 0.1
        const background_padding = 8

        drawSquircle(ctx,
            this.position.x - x_offset_value - background_padding,
            this.position.y + this.sprite.size.y * 1.05 - background_padding,
            this.sprite.size.x + x_offset_value + background_padding * 2,
            16 + background_padding * 2,
            8 + background_padding, "#28202818")

        // draw grey background
        drawSquircle(ctx,
            this.position.x - x_offset_value,
            this.position.y + this.sprite.size.y * 1.05,
            this.sprite.size.x + x_offset_value,
            16,
            8, "#b89898")
        
        // draw red healthbar
        const health_percentage = Math.max(0, this.HP / this.MAX_HP)
        const health_bar_width = (this.sprite.size.x + x_offset_value) * health_percentage
        // if the enemy is still alive, draw the remaining HP
        if ( health_bar_width > 8 ) {
            drawSquircle(ctx,
                this.position.x - x_offset_value,
                this.position.y + this.sprite.size.y * 1.05,
                health_bar_width,
                16,
                8, "#ee3838")
        }

        // draw the text on the healthbar
        const font_size = 32
        ctx.fillStyle = "#884f45"
        ctx.font = `${font_size}px kalam-regular`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(
            `${Math.ceil(this.HP)}/${this.MAX_HP}`,
            this.position.x - x_offset_value + this.sprite.size.x / 2,
            this.position.y + this.sprite.size.y * 1.05 + font_size / 2 - 1
        )

        ctx.fillStyle = "#ffffff"
        ctx.font = `${font_size - 1}px kalam-bold`
        ctx.fillText(
            `${Math.ceil(this.HP)}/${this.MAX_HP}`,
            this.position.x - x_offset_value + this.sprite.size.x / 2,
            this.position.y + this.sprite.size.y * 1.05 + font_size / 2 + 1
        )
    }

    turnStart() {
        console.log("sick i can do things")
        this.drawHand()
    }

    turnEnd() {
        this.discardHand()
    }
}