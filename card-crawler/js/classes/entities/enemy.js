import { global, ctx, inputManager, hudCtx } from "../../global.js"
import { drawSquircle } from "../../tems_library/rendering.js";
import { call_deferred } from "../../tems_library/tems_library.js";
import { UIElement } from "../parents/UI_element.js";

export class Enemy extends UIElement {
    constructor(pos, size) {
        super(pos, size)

        
        this.MAX_HP = 20
        this.name = "bipis"
        this.sprite = null

        this.mouse_down = false
    }

    register() {
        this.HP = this.MAX_HP
        this.display_HP = this.HP

        if (this.sprite == null) {
            this.sprite = global.assets["beaver"].newClone()
        }

        if (this.actions == null) {
            this.actions = []
        }

        this.sprite.setPosition(this.position.x, this.position.y)
        this.sprite.setSize(this.size.x, this.size.y)

        const self = this 
        this.handleUIMouseDown = async function(event) {
            self.mouse_down = true
        }
        
        this.mouseUp = function() { this.mouse_down = false }
        this.handleUIMouseUp = async function(event) {
            call_deferred(self, "mouseUp")
        }
    
        this.handleUIClick = async function(event) {
            if (self.mouse_down) {
                self.mouse_down = false
                const player = global.player
                const card = global.player.focused_card

                if (player.focused_card_state != "targeting") {
                    console.log("tried playing target card whilst focused state is not targeting, returning")
                    return
                }
                        
                card.targeting_enemy = self
                player.play_queue.push(card)
                player.hand = player.hand.filter((local_card) => local_card != card)
                card.cleanDragingCard()
            }
        }
    }

    tick() {
        if (this.display_HP > this.HP) {
            const difference = Math.abs(this.HP - this.display_HP)
            this.display_HP -= (difference / 350) * global.delta_time + 0.03

            // kill the enemy if it appears to be dead
            if (this.display_HP <= 0) {
                global.current_room.enemies = global.current_room.enemies.filter((enemy) => enemy != this)
            }
        }

        if (this.hovering) {
            if (global.player.focused_card_state == "targeting") this.drawBackground()

            this.drawName()
        }
        
        this.sprite.draw()
        this.drawHealthBar()
    }

    drawBackground() {
        drawSquircle(ctx,
            this.position.x - this.sprite.size.x * 0.1,
            this.position.y - this.sprite.size.y * 0.1,
            this.sprite.size.x * 1.2,
            this.sprite.size.y * 1.2,
            this.size.x / 8 + this.size.y / 8, "#b898b84f")
    }

    drawName() {
        const font_size = 24 
        ctx.fillStyle = "#884f45"
        ctx.font = `${font_size}px kalam-regular`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(
            `${this.name}`,
            this.position.x + this.sprite.size.x / 2,
            this.position.y + this.sprite.size.y * 1.2125 + ctx.canvas.height / 55
        )
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
            this.sprite.size.x + x_offset_value * 2 + background_padding * 2,
            bar_height + background_padding * 2,
            bar_rounding + background_padding, "#28202844")

        // draw grey background
        drawSquircle(ctx,
            this.position.x - x_offset_value,
            this.position.y + this.sprite.size.y * 1.05,
            this.sprite.size.x + x_offset_value * 2,
            bar_height,
            bar_rounding, "#b89898")
        
        // draw red healthbar
        const health_percentage = Math.max(0, this.display_HP / this.MAX_HP)
        const health_bar_width = (this.sprite.size.x + x_offset_value * 2) * health_percentage
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
        const text_string = `${Math.max(0, Math.ceil(this.HP))}/${this.MAX_HP}`
        // red background
        ctx.fillStyle = "#884f45"
        ctx.font = `${font_size}px kalam-regular`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        ctx.fillText(
            text_string,
            this.position.x + this.sprite.size.x / 2,
            this.position.y + this.sprite.size.y * 1.065 + font_size / 2 - 4
        )

        ctx.fillStyle = "#ffffff"
        ctx.font = `${font_size - 1}px kalam-bold`
        ctx.fillText(
            text_string,
            this.position.x + this.sprite.size.x / 2,
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