import { randFloat, randInt, canvas_centre, drawWithScreenWrap } from "../../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../../global.js"
import { UIElement } from "./UI_element.js";
import { splitTextToFit } from "../../misc.js";

export class Card extends UIElement {
    constructor(colour) {
        super(
            {x: 0, y: 0},
            {x: 190, y: 280}
        )
        
        this.colour = colour;
        
        this.rotation = 0
        this.hand_ratio = 0.5

        this.hovering = false;
        this.name_font_size = 28
        this.description_font_size = 18
        
        this.name = "Default Name"
        this.description = "gravida cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus mauris vitae"
    }

    register() {
        this.display_description = splitTextToFit(this.description, 110)

        const card = this
        this.handleUIClick = async function(event) {
            global.player.play_queue.push(card)
            console.log(`playing "${card.name}"...`)
        }
        
        if (this.play == null) {
            this.play = function() {
                console.log(`the card "${card.name}" doesn't have any play function`)
            }
        }
    }

    draw() {
        const y_offset = Math.abs((0.5-this.hand_ratio)*100)
        const rotation_offset = 0.1
        
        ctx.translate(this.position.x + this.size.x/2, this.position.y + y_offset)
        ctx.rotate(this.rotation * rotation_offset)
        ctx.translate(-this.size.x/2, 0)

        // border
        if (this.hovering) {
            ctx.fillStyle = "#f8f8f8"
            ctx.fillRect(-3, -3, this.size.x+6, this.size.y+6);
        }

        // background
        ctx.fillStyle = this.colour;
        ctx.fillRect(0, 0, this.size.x, this.size.y);

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


        ctx.setTransform(1, 0, 0, 1, 0, 0)
    }
    
    tick() {
        if (this.processing) {
            this.draw()
        }
    }
}