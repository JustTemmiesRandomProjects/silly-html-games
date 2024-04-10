import { global, ctx, inputManager, focusingCardCtx } from "../../global.js"
import { UIElement } from "./UI_element.js";
import { splitTextToFit } from "../../misc.js";
import { drawBezierArrow, drawSquircle } from "../../tems_library/rendering.js";
import { call_deferred } from "../../tems_library/tems_library.js";

class CardHelper {
    constructor() {

    }

    damageEnemy(enemy, damage) {
        console.log(`dealing ${damage} damage to ${enemy.name}`)
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
            {x: 240, y: 335}
        )
        
        this.colour = colour;

        this.hand_ratio = 0.5
        this.miliseconds_focused = 0
        
        this.hovering = false;
        this.name_font_size = 36
        this.description_font_size = 24
        
        this.name = "Bepis"
        this.description = "gravida cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus mauris vitae"
        
        this.card_helper = new CardHelper()
    }

    register() {
        this.display_description = splitTextToFit(this.description, 110)
        
        if (this.play == null) {
            console.log(`[WARNING] the card "${self.name}" doesn't have any play function`)
            this.play = function() {
                return
            }
        }

        const self = this 
        this.handleUIClick = async function(event) {
            if (global.player.focused_card != self) {
                if (global.debug_mode) {
                    console.log(`${self.name} is not being focused, returning early`)
                }
                return
            }
            
            // self.becomeDraged(self)

            // ctx.canvas.removeEventListener("click", self.handleUIClick)
        }

        this.handleUIMouseDown = async function(event) {
            if (global.player.focused_card != self) {
                if (global.debug_mode) {
                    console.log(`${self.name} is not being focused, returning early`)
                }
                return
            }

            self.becomeDraged(self)
        }

        this.handleDragingClick = async function(event) {
            if (self.position.y > 0 && self.position.y < ctx.canvas.height * 0.7) {
                global.player.play_queue.push(self)
                global.player.hand = global.player.hand.filter((local_card) => local_card != self)
    
                self.cleanDragingCard()
            }
        }

        this.handleUIRightClick = async function(event) {
            self.cleanDragingCard()
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

    becomeDraged(self) {
        global.player.focused_card = self
        global.player.focused_card_state = "draging"

        ctx.canvas.addEventListener("click", self.handleDragingClick)
    }

    cleanDragingCard() {
        console.log("clean!")
        ctx.canvas.removeEventListener("click", this.handleDragingClick)
        this.miliseconds_focused = 0
        global.player.focused_card = null
        global.player.focused_card_state = null

        this.UIExit()
        focusingCardCtx.clearRect(0, 0, focusingCardCtx.canvas.width, focusingCardCtx.canvas.height)
    }

    drawTargetingCard() {
        const player = global.player


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

        // border
        if (global.player.focused_card == this) {
            drawSquircle(ctx, -3, -3, this.size.x+6, this.size.y+6, 19, "#102f10")
        }

        // background
        drawSquircle(ctx, 0, 0, this.size.x, this.size.y, 16, this.colour)

        this.drawText(ctx)

        ctx.setTransform(1, 0, 0, 1, 0, 0)

        this.renderArrow()
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

        // border
        drawSquircle(focusingCardCtx, -3, -3, this.size.x+6, this.size.y+6, 19, "#102f10")

        // background
        drawSquircle(focusingCardCtx, 0, 0, this.size.x, this.size.y, 16, this.colour)

        this.drawText(focusingCardCtx)

        focusingCardCtx.setTransform(1, 0, 0, 1, 0, 0)
    }

    draw() {
        const hand = global.player.hand
        // cap it at 90
        this.miliseconds_focused = Math.min(90, this.miliseconds_focused)

        const scale = 1 + (global.player.constants.focused_card_multiplier * this.miliseconds_focused / 90)
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

        // border
        // if (global.player.focused_card == this) {
            drawSquircle(ctx, -3, -3, this.size.x+6, this.size.y+6, 19, "#102f10")
        // }

        // background
        drawSquircle(ctx, 0, 0, this.size.x, this.size.y, 16, this.colour)

        this.drawText(ctx)

        ctx.setTransform(1, 0, 0, 1, 0, 0)
    }
    
    tick() {
        if (this.processing) {  
            const player = global.player

            if (player.focused_card == this ){
                this.miliseconds_focused += global.delta_time * 2

                if (player.focused_card_state == "draging" ) {
                    // if the card is low enough to "be out of play"
                    if (inputManager.mouse.y > ctx.canvas.height * 0.945) {
                        this.cleanDragingCard()
                        return
                    }

                    call_deferred(this, "drawDragingCard")
                } else if (player.focused_card_state == "hovering") {
                    call_deferred(this, "draw")
                } else if (player.focused_card_state == "targeting") {
                    if (inputManager.mouse.y > ctx.canvas.height * 0.945) {
                        this.cleanDragingCard()
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


    renderArrow() {
        drawBezierArrow(focusingCardCtx, 
            {x: this.position.x + this.size.x / 2, y: this.position.y + this.size.y / 2},
            inputManager.mouse)
    }
}