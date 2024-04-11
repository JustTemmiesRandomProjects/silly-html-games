import { global, ctx, inputManager } from "../../global.js"
import { drawSquircle } from "../../tems_library/rendering.js";
import { UIElement } from "../parents/UI_element.js";

export class Enemy extends UIElement {
    constructor() {
        super(
            {x: 1000, y:220},
            {x: 240,  y:240}
        )

        this.MAX_HP = 20
        this.HP = this.MAX_HP
        this.display_HP = this.HP

        this.name = "bipis"
        this.sprite = global.assets["beaver"]

        this.register()
    }

    register() {
        this.sprite.setPosition(this.position.x, this.position.y)
        this.sprite.setSize(this.size.x, this.size.y)
    }

    tick() {
        if (this.display_HP > this.HP) {
            const difference = Math.abs(this.HP - this.display_HP)
            this.display_HP -= (difference / 350) * global.delta_time + 0.03
        }
        this.sprite.draw()
        this.drawHealthBar()
    }

    drawHealthBar() {
        const x_offset_value = this.sprite.size.x * 0.1
        const background_padding = 8

        const bar_height = 4 + this.sprite.size.x / 16
        const bar_rounding = 2 + this.sprite.size.x / 32
        

        // draw the border around the bar
        drawSquircle(ctx,
            this.position.x - x_offset_value - background_padding,
            this.position.y + this.sprite.size.y * 1.05 - background_padding,
            this.sprite.size.x + x_offset_value + background_padding * 2,
            bar_height + background_padding * 2,
            bar_rounding + background_padding, "#28202844")

        // draw grey background
        drawSquircle(ctx,
            this.position.x - x_offset_value,
            this.position.y + this.sprite.size.y * 1.05,
            this.sprite.size.x + x_offset_value,
            bar_height,
            bar_rounding, "#b89898")
        
        // draw red healthbar
        const health_percentage = Math.max(0, this.display_HP / this.MAX_HP)
        const health_bar_width = (this.sprite.size.x + x_offset_value) * health_percentage
        // if the enemy is still alive, draw the remaining HP
        if ( health_bar_width > 8 ) {
            drawSquircle(ctx,
                this.position.x - x_offset_value,
                this.position.y + this.sprite.size.y * 1.05,
                health_bar_width,
                bar_height,
                bar_rounding, "#ee3838")
        }

        // draw the text on the healthbar
        const font_size = 16 + this.sprite.size.x / 16
        // red background
        ctx.fillStyle = "#884f45"
        ctx.font = `${font_size}px kalam-regular`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(
            `${Math.ceil(this.HP)}/${this.MAX_HP}`,
            this.position.x - x_offset_value + this.sprite.size.x / 2,
            this.position.y + this.sprite.size.y * 1.065 + font_size / 2 - 4
        )

        ctx.fillStyle = "#ffffff"
        ctx.font = `${font_size - 1}px kalam-bold`
        ctx.fillText(
            `${Math.ceil(this.HP)}/${this.MAX_HP}`,
            this.position.x - x_offset_value + this.sprite.size.x / 2,
            this.position.y + this.sprite.size.y * 1.065 + font_size / 2 - 2
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