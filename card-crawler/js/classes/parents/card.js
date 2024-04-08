import { randFloat, randInt, canvas_centre, drawWithScreenWrap, drawSquircle, call_deferred } from "../../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../../global.js"
import { UIElement } from "./UI_element.js";
import { splitTextToFit } from "../../misc.js";

class CardHelper {
    constructor() {

    }

    damageEnemy(enemy, damage) {
        console.log(`dealing ${damage} to ${enemy}`)
        enemy.HP -= damage
    }

    damageAllEnemies(damage) {
        global.current_room.enemies.forEach((enemy) => {
            this.damageEnemy(enemy, damage)
        })
    }
}

export class Card extends UIElement {
    constructor(colour) {
        super(
            {x: 0, y: 0},
            {x: 240, y: 330}
        )
        
        this.colour = colour;

        this.hand_ratio = 0.5
        this.miliseconds_hovered = 0
        
        this.hovering = false;
        this.name_font_size = 36
        this.description_font_size = 24
        
        this.name = "Default Name"
        this.description = "gravida cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus mauris vitae"
        
        this.card_helper = new CardHelper()
    }

    register() {
        this.display_description = splitTextToFit(this.description, 110)

        const card = this
        this.handleUIClick = async function(event) {
            console.log(global.player.hovering == card)
            if (global.player.hovering != card) {
                console.log(`${card.name} is not being hovered, returning early`)
                return
            }

            global.player.play_queue.push(card)
            console.log(`playing "${card.name}"...`)

            ctx.canvas.removeEventListener("click", card.handleUIClick)
        }
        
        if (this.play == null) {
            this.play = function() {
                console.log(`the card "${card.name}" doesn't have any play function`)
            }
        }
    }

    drawText() {
        // text 
        ctx.fillStyle = "#454f45";
        ctx.font = `${this.description_font_size}px kalam-regular`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let line_count = this.display_description.length
        // how much we should shift the text up
        let shift_up_amount = line_count*(this.description_font_size + 2) / 2 - 20
        for (let i = 0; i < line_count; i++) {
            let line = this.display_description[i]
            let shift_down_amount = (i+1)*(this.description_font_size + 2)
            ctx.fillText(
                line,
                (this.size.x / 2),
                (this.size.y / 2) - shift_up_amount + shift_down_amount,
            )
        }

        ctx.font = `${this.name_font_size}px kalam-bold`;
        ctx.fillText(
            this.name,
            this.size.x / 2,
            this.name_font_size + 8,
        );
    }

    draw() {        
        const hand = global.player.hand
        // cap it at 90
        this.miliseconds_hovered = Math.min(90, this.miliseconds_hovered)

        const scale = 1 + (global.player.constants.focused_card_multiplier * this.miliseconds_hovered / 90)
        const scale_time_value = (scale - 1) / global.player.constants.focused_card_multiplier

        ctx.setTransform(scale, 0, 0, scale, 0, 0)

        let this_card_y = this.position.y
        let middle_card_y = this_card_y
        if (hand.length > 0) {
            middle_card_y = hand[Math.floor(hand.length / 2)].position.y
        }

        ctx.translate(
            // this just works, don't worry about it
            this.position.x / scale - this.size.x * (scale / 11) + this.size.x/2,

            this_card_y * (1 - scale_time_value)
            + middle_card_y * scale_time_value
            - this.size.y*(scale * 3 - 3)
        )

        ctx.rotate(this.rotation * (1 - scale_time_value))
        ctx.translate(-this.size.x/2, 0)

        // border
        if (global.player.hovering == this) {
            drawSquircle(ctx, -3, -3, this.size.x+6, this.size.y+6, 19, "#102f10")
        }

        // background
        drawSquircle(ctx, 0, 0, this.size.x, this.size.y, 16, this.colour)

        this.drawText()

        ctx.setTransform(1, 0, 0, 1, 0, 0)
    }
    
    tick() {
        if (this.processing) {
            if (global.player.hovering == this) {
                this.miliseconds_hovered += global.delta_time * 2
                this.draw()

            } else {
                this.miliseconds_hovered = Math.max(0, this.miliseconds_hovered - global.delta_time)
                this.draw()
            }
        }
    }
}