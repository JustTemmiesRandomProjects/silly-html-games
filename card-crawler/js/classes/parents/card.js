import { global, ctx, inputManager, focusingCardCtx } from "../../global.js"
import { UIElement } from "./UI_element.js";
import { splitTextToFit } from "../../misc.js";
import { drawBezierArrow, drawSquircle } from "../../tems_library/rendering.js";
import { call_deferred } from "../../tems_library/tems_library.js";

export class Card extends UIElement {
    constructor(colour) {
        super(
            {x: 0, y: 0},
            {x: 240, y: 335}
        )
        
        this.colour = colour;

        this.card_reward_ID = null

        this.hand_ratio = 0.5
        this.miliseconds_focused = 0
        // if the card has been dragged high enough to be removed by draging it down
        this.dragged_out = false
        
        this.hovering = false;
        this.name_font_size = 28
        this.description_font_size = 24
        
        this.border_size = 4
        
        this.name = "Bepis"
        this.description = "gravida cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus mauris vitae"
    }

    register() {
        if (this.energy_icon == null) {
            this.energy_icon = global.player.energy_icon.newClone()
        }
        

        console.log("rendering display description...")
        this.generateDisplayDescription()
        this.energy_icon.setPosition(-18, 0)
        this.energy_icon.setSize(global.player.energy_icon.size.x, global.player.energy_icon.size.y)
        
        if (this.play == null) {
            console.log(`[WARNING] the card "${self.name}" doesn't have any play function`)
            this.play = function() {
                return
            }
        }

        if (this.energy_cost == null) {
            this.energy_cost = 1
        }

        const self = this 
        this.handleUIMouseDown = async function(event) {
            if (global.player.focused_card != self) {
                if (global.debug_mode) {
                    console.log(`${self.name} is not being focused, returning early`)
                }
                return
            }
            
            self.becomeDraged(self)
            console.log("drag:)")
        }

        this.handleDragingClick = async function(event) {
            if (self.position.y > 0 && self.position.y < ctx.canvas.height * 0.7) {
                self.dragged_out = false
                global.player.play_queue.push(self)
                // global.player.hand = global.player.hand.filter((local_card) => local_card != self)
    
                self.cleanDragingCard()
            }
        }


        ctx.canvas.addEventListener("contextmenu", function(event) {
            self.cleanDragingCard()
            self.dragged_out = false
        })
    }

    generateDisplayDescription() {
        this.display_description = splitTextToFit(
            this.description,
            this.size.x * 0.9,
            `${this.description_font_size}px kalam-regular`)
    }
    
    drawEnergyCost(ctx) {
        // energy icon background
        const icon = this.energy_icon
        ctx.beginPath();
        ctx.arc(
            icon.position.x + icon.size.x/2,
            icon.position.y + icon.size.y/2,
            icon.size.x * 0.75
            , 0, 2 * Math.PI, false);
        
        ctx.fillStyle = "#8cc38c";
        ctx.fill();
        //border
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        
        // icon.draw()
        
        // energy text
        ctx.fillStyle = "#454545";
        ctx.font = `64px kalam-bold`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            `${this.energy_cost}`,
            (icon.position.x + icon.size.x/2),
            (icon.position.y + icon.size.y/2 + 12)
        )
    }

    drawBorder(ctx) {
        // border
        if (global.player.energy >= this.energy_cost) {
            drawSquircle(ctx,
                -this.border_size, -this.border_size,
                this.size.x+(this.border_size * 2), this.size.y+(this.border_size * 2),
                19, "#8cc38c")        
        } else {
            drawSquircle(ctx,
                -this.border_size, -this.border_size,
                this.size.x+(this.border_size * 2), this.size.y+(this.border_size * 2),
                19, "#2f3f2f")
        }
    }
    
    drawText(ctx) {
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
                this.size.x / 2,
                this.size.y / 2 - shift_up_amount + shift_down_amount,
            )
        }

        ctx.font = `${this.name_font_size}px kalam-bold`;
        ctx.fillText(
            this.name,
            this.size.x / 2,
            this.name_font_size + 8,
        );
    }

    becomeDraged(self) {
        global.player.focused_card = self
        global.player.focused_card_state = "draging"

        ctx.canvas.addEventListener("click", self.handleDragingClick)
    }

    cleanDragingCard() {
        ctx.canvas.removeEventListener("click", this.handleDragingClick)
        this.miliseconds_focused = 0
        global.player.focused_card = null
        global.player.focused_card_state = null

        this.UIExit()
        focusingCardCtx.clearRect(0, 0, focusingCardCtx.canvas.width, focusingCardCtx.canvas.height)
    }
    

    drawTargetingCard() {
        const player = global.player

        if (player.hand.length == 0) return


        if (player.hand.length % 2 == 0) {
            const middle_card1 = player.hand[player.hand.length / 2 - 1]
            const middle_card2 = player.hand[player.hand.length / 2]
            

            this.position.x = (middle_card1.position.x + middle_card2.position.x) / 2 + 66.7 - this.size.x / 2
            this.position.y = (middle_card1.position.y + middle_card2.position.y) / 2 - this.size.y / 4
            this.rotation = (middle_card1.rotation + middle_card2.rotation) / 2
            
        } else {
            const middle_card = player.hand[Math.floor(player.hand.length / 2)]


            this.position.x = middle_card.position.x + 100 - this.size.x/2
            this.position.y = middle_card.position.y - 120
            this.rotation = middle_card.rotation
        }

        ctx.translate(
            this.position.x,
            this.position.y
        )

        this.drawBorder(ctx)

        // background
        drawSquircle(ctx, 0, 0, this.size.x, this.size.y, 16, this.colour)

        this.drawEnergyCost(ctx)
        this.drawText(ctx)

        ctx.setTransform(1, 0, 0, 1, 0, 0)

        this.drawArrow()
    }

    drawDragingCard() {
        focusingCardCtx.clearRect(0, 0, focusingCardCtx.canvas.width, focusingCardCtx.canvas.height)

        const scale = 1 + (global.player.constants.focused_card_multiplier)
        focusingCardCtx.setTransform(scale, 0, 0, scale, 0, 0)
        
        this.position.x = inputManager.mouse.x
        this.position.y = inputManager.mouse.y

        focusingCardCtx.translate(
            this.position.x / scale - this.size.x / 2,
            this.position.y / scale - this.size.y / 2
        )

        this.drawBorder(focusingCardCtx)

        // background
        drawSquircle(focusingCardCtx, 0, 0, this.size.x, this.size.y, 16, this.colour)


        this.drawEnergyCost(focusingCardCtx)
        this.drawText(focusingCardCtx)

        focusingCardCtx.setTransform(1, 0, 0, 1, 0, 0)
    }

    drawReward(ctx) {
        const scale = 1 + (global.player.constants.focused_card_multiplier * this.miliseconds_focused / 70)

        ctx.setTransform(scale, 0, 0, scale, 0, 0)
        ctx.translate(
            this.position.x / scale
            + this.size.x / 2 / scale
            - this.size.x / 2,

            this.position.y / scale
            + this.size.y / 2 / scale
            - this.size.y / 2
        )

        drawSquircle(ctx,
            -this.border_size, -this.border_size,
            this.size.x+(this.border_size * 2), this.size.y+(this.border_size * 2),
            19, "#2f3f2f")
        
        // background
        drawSquircle(ctx, 0, 0, this.size.x, this.size.y, 16, this.colour)
        

        this.drawEnergyCost(ctx)
        this.drawText(ctx)

        ctx.setTransform(1, 0, 0, 1, 0, 0)
    }

    draw() {
        const hand = global.player.hand
        // cap it at 90
        this.miliseconds_focused = Math.min(70, this.miliseconds_focused)

        const scale = 1 + (global.player.constants.focused_card_multiplier * this.miliseconds_focused / 70)
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
            + (ctx.canvas.height - this.size.y * 1.50) * scale_time_value
            // - this.size.y*(scale * 3 - 3)
        )

        ctx.rotate(this.rotation * (1 - scale_time_value))
        ctx.translate(-this.size.x/2, 0)
        
        this.drawBorder(ctx)

        // background
        drawSquircle(ctx, 0, 0, this.size.x, this.size.y, 16, this.colour)
        

        this.drawEnergyCost(ctx)
        this.drawText(ctx)

        ctx.setTransform(1, 0, 0, 1, 0, 0)
    }
    
    tick() {
        this.genericEntityTick()
        
        if (this.processing) {  
            const player = global.player
            
            if (player.focused_card == this ){
                if (inputManager.mouse.y < ctx.canvas.height * 0.73) {
                    this.dragged_out = true
                }

                this.miliseconds_focused += global.delta_time
                
                if (player.focused_card_state == "draging" ) {
                    // if the card is low enough to "be out of play"
                    if ((inputManager.mouse.y > ctx.canvas.height * 0.83 && this.dragged_out)
                        || inputManager.mouse.y  >= ctx.canvas.height - 1) {
                        this.cleanDragingCard()
                        this.dragged_out = false
                        return
                    }

                    call_deferred(this, "drawDragingCard")

                } else if (player.focused_card_state == "hovering") {
                    call_deferred(this, "draw")

                } else if (player.focused_card_state == "targeting") {
                    if ((inputManager.mouse.y > ctx.canvas.height * 0.83 && this.dragged_out)
                        || inputManager.mouse.y  >= ctx.canvas.height - 1) {
                        this.cleanDragingCard()
                        this.dragged_out = false
                        return
                    }

                    call_deferred(this, "drawTargetingCard")
                }
                
            } else {
                this.miliseconds_focused = Math.max(0, this.miliseconds_focused - global.delta_time)
                this.draw()
            }
        }
    }


    drawArrow() {
        drawBezierArrow(focusingCardCtx, 
            {x: this.position.x + this.size.x / 2, y: this.position.y + this.size.y / 2},
            inputManager.mouse)
    }
}