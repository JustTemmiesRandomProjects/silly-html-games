import { global, ctx, inputManager, hoveringCardCtx } from "../../global.js"
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
            {x: 240, y: 330}
        )
        
        this.colour = colour;

        this.hand_ratio = 0.5
        this.miliseconds_hovered = 0
        
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
            console.log(`[WARNING] the card "${card.name}" doesn't have any play function`)
            this.play = function() {
                return
            }
        }

        const self = this
        this.handleUIClick = async function(event) {
            if (global.player.hovering_card != self) {
                if (global.debug_mode) {
                    console.log(`${self.name} is not being hovered, returning early`)
                }
                return
            }
            
            // self.becomeDraged(self)

            // ctx.canvas.removeEventListener("click", self.handleUIClick)
        }

        this.handleUIMouseDown = async function(event) {
            if (global.player.hovering_card != self) {
                if (global.debug_mode) {
                    console.log(`${self.name} is not being hovered, returning early`)
                }
                return
            }

            self.becomeDraged(self)
        }

        this.handleDragingClick = async function(event) {
            console.log(self.position.y, ctx.canvas.height * 0.7)
            if (self.position.y > 0 && self.position.y < ctx.canvas.height * 0.7) {
                global.player.play_queue.push(self)
                global.player.hand = global.player.hand.filter((local_card) => local_card != self)
    
                self.cleanDragingCard()
            }
        }
    }

    becomeDraged(self) {
        global.player.draging_card = self

        ctx.canvas.addEventListener("click", self.handleDragingClick)
        
        self.handleUIRightClick = async function(event) {


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

    cleanDragingCard() {
        ctx.canvas.removeEventListener("click", this.handleDragingClick)
        global.player.draging_card = null
        global.player.hovering = null

        this.UIExit()
        hoveringCardCtx.clearRect(0, 0, hoveringCardCtx.canvas.width, hoveringCardCtx.canvas.height)
    }

    drawDragingCard() {
        hoveringCardCtx.clearRect(0, 0, hoveringCardCtx.canvas.width, hoveringCardCtx.canvas.height)

        const scale = 1 + (global.player.constants.focused_card_multiplier)
        hoveringCardCtx.setTransform(scale, 0, 0, scale, 0, 0)
        
        this.position.x = inputManager.mouse.x
        this.position.y = inputManager.mouse.y

        hoveringCardCtx.translate(
            this.position.x / scale - this.size.x / 2,
            this.position.y / scale - this.size.y / 2
        )

        // border
        drawSquircle(hoveringCardCtx, -3, -3, this.size.x+6, this.size.y+6, 19, "#102f10")

        // background
        drawSquircle(hoveringCardCtx, 0, 0, this.size.x, this.size.y, 16, this.colour)

        this.drawText(hoveringCardCtx)

        hoveringCardCtx.setTransform(1, 0, 0, 1, 0, 0)
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
        if (global.player.hovering_card == this) {
            drawSquircle(ctx, -3, -3, this.size.x+6, this.size.y+6, 19, "#102f10")
        }

        // background
        drawSquircle(ctx, 0, 0, this.size.x, this.size.y, 16, this.colour)

        this.drawText(ctx)

        ctx.setTransform(1, 0, 0, 1, 0, 0)
    }
    
    tick() {
        if (this.processing) {            
            if (global.player.draging_card == this ){
                // if the card is low enough to "be out of play"
                if (this.position.y > ctx.canvas.height * 0.945) {
                    this.cleanDragingCard()
                    return
                }

                call_deferred(this, "drawDragingCard")
                
            } else if (global.player.hovering_card == this) {
                this.miliseconds_hovered += global.delta_time * 2
                call_deferred(this, "draw")
                
            } else {
                this.miliseconds_hovered = Math.max(0, this.miliseconds_hovered - global.delta_time)
                this.draw()
            }
        }
    }
}