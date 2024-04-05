import { randFloat, randInt, canvas_centre, drawWithScreenWrap, drawSquircle, call_deferred } from "../../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../../global.js"
import { UIElement } from "./UI_element.js";
import { splitTextToFit } from "../../misc.js";

export class Card extends UIElement {
    constructor(colour) {
        super(
            {x: 0, y: 0},
            {x: 240, y: 330}
        )
        
        this.colour = colour;
        
        this.hand_ratio = 0.5

        this.hovering = false;
        this.name_font_size = 36
        this.description_font_size = 24
        
        this.name = "Default Name"
        this.description = "gravida cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus mauris vitae"
    }

    register() {
        this.display_description = splitTextToFit(this.description, 110)

        const card = this
        this.handleUIClick = async function(event) {
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

    hoverDraw() {
        const hand = global.player.hand
        const scale = 1.3
        ctx.setTransform(scale, 0, 0, scale, 0, 0)
        ctx.translate(
            // this just works, don't worry about it
            // 1.5 scale, (0.25 + 0.125) / 2 == 0.1875
            // scale / 6 + scale / 12 / 2?
            // 2 scale, 2/12 + 2/24 == 6/24 == 1/4
            // bro i don't know at this point anymore
            this.position.x / scale - this.size.x * (scale / 11),
            // get the y position of the centre hand in the hand
            hand[Math.floor(hand.length / 2)].position.y / scale
                - this.size.y / 2
        )

        // border
        drawSquircle(ctx, -3, -3, this.size.x+6, this.size.y+6, 18, "#102f10")

        // background
        drawSquircle(ctx, 0, 0, this.size.x, this.size.y, 16, this.colour)

        this.drawText()

        ctx.setTransform(1, 0, 0, 1, 0, 0)
    }

    draw() {
        ctx.translate(this.position.x + this.size.x/2, this.position.y)
        ctx.rotate(this.rotation)
        ctx.translate(-this.size.x/2, 0)

        // background
        drawSquircle(ctx, 0, 0, this.size.x, this.size.y, 16, this.colour)

        this.drawText()

        ctx.setTransform(1, 0, 0, 1, 0, 0)
    }
    
    tick() {
        if (this.processing) {
            if (!this.hovering) {
                this.draw()
            } else {
                call_deferred(this, "hoverDraw")
            }
        }
    }
}