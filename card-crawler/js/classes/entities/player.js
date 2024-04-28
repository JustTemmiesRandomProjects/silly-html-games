import { randFloat, randInt, canvas_centre, shuffleArray, call_deferred, sleep } from "../../tems_library/tems_library.js"
import { global, ctx, inputManager, focusingCardCtx } from "../../global.js"
import { Entity } from "../parents/baseEntity.js";
import { bezierCurvePointAxis } from "../../tems_library/math.js";
import { drawSquircle } from "../../tems_library/rendering.js";

export class Player extends Entity {
    constructor() {
        super()

        this.hand = []
        this.deck = []

        this.deck_pile = []
        this.discard_pile = []

        this.playing = null
        this.focused_card = null
        // this is either "targeted", "draging", "hovering", etc.
        this.focused_card_state = null

        // this.target_card = null
        // this.draging_card = null
        // this.hovering_card = null

        this.hovering_card_index = 0
        this.hand_x_start_pos = 0
        this.play_cooldown = 0
        this.play_queue = []
        this.render_hud = true
        
        this.MAX_ENERGY = 3
        this.energy = this.MAX_ENERGY

        this.MAX_HP = 70
        this.HP = this.MAX_HP
        this.display_HP = this.HP

        this.energy_icon = global.assets["beaver"].newClone()
        this.energy_icon.setSize(48, 48)

        this.constants = {
            draw_amount: 5,
            max_hand_size: 9,
            max_distance_between_cards: 215,
            max_hand_width: (ctx.canvas.width / 6) * 3.3,
            focused_card_multiplier: 0.2, // 0.3, as in 1 + 0.3
            focused_card_margins: 130,
        }
    }

    drawEnergyWheel(ctx) {
        // energy icon background
        const icon = this.energy_icon
        ctx.beginPath();
        ctx.arc(
            ctx.canvas.width / 6,
            ctx.canvas.height * 0.42,
            icon.size.x * 0.75
            , 0, 2 * Math.PI, false);
        
        ctx.fillStyle = "#8BC38C";
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
            `${this.energy}`,
            ctx.canvas.width / 6,
            ctx.canvas.height * 0.42 + 12
        )
    }

    drawHealthBar() {
        const background_padding = 8

        const bar_rounding = 6

        const size = {
            x: ctx.canvas.width / 6,
            y: 25
        }

        const position = {
            x: ctx.canvas.width / 8 - size.x / 2,
            y: ctx.canvas.height * 0.535 - size.y
        }

        

        // draw the border around the bar
        drawSquircle(ctx,
            position.x - background_padding,
            position.y - background_padding,
            size.x + background_padding * 2,
            size.y + background_padding * 2,
            bar_rounding + background_padding, "#28202844")

        // draw dark-red background
        drawSquircle(ctx,
            position.x,
            position.y,
            size.x,
            size.y,
            bar_rounding, "#b89898")
        
        // draw red healthbar
        const health_percentage = Math.max(0, this.display_HP / this.MAX_HP)
        const health_bar_width = (size.x) * health_percentage
        // if the enemy is still alive, draw the remaining HP
        if ( health_bar_width > 8 ) {
            drawSquircle(ctx,
                position.x,
                position.y,
                health_bar_width,
                size.y,
                bar_rounding, "#ee3838")
        }

        // draw the text on the healthbar
        const font_size = 40
        // red background
        ctx.font = `${font_size}px kalam-bold`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"        
        ctx.fillStyle = "#ffffff"
        ctx.fillText(
            `${this.HP}/${this.MAX_HP}`,
            position.x + size.x / 2,
            position.y + font_size / (1 + font_size / 48)
        )
    }


    drawHand() {
        this.drawCards(this.constants.draw_amount)

        console.log(this.hand)
        console.log(`current hand: ${this.hand.length}`)
        console.log(`current deck: ${this.deck_pile.length}`)
        console.log(`current discard_pile: ${this.discard_pile.length}`)
    }
    
    renderHand() {
        const hand_size = this.hand.length
        const screen_width = ctx.canvas.width
        const screen_height = ctx.canvas.height
        
        if (hand_size == 0) { return }

        let max_hand_width = this.constants.max_hand_width
            
        
        if ([null, "hovering"].includes(this.focused_card_state)) {
            this.focused_card = null
            this.hovering_card_index = null
            for (let i = 0; i < hand_size; i++) {
                if (this.hand[i].hovering) {
                    this.focused_card = this.hand[i]
                    this.focused_card_state = "hovering"
                    this.hovering_card_index = i
                }
            }
        }

        this.dist_between_cards = Math.min(
            Math.min(
                hand_size * this.constants.max_distance_between_cards * 1.2,
                max_hand_width
            ) / hand_size,
            // cap it at the actual max hand size
            this.constants.max_distance_between_cards
        )

        this.horizontal_space = this.dist_between_cards * hand_size
        this.hand_x_start_pos = (screen_width - this.horizontal_space) / 2
        
        const hand_rotation_ratio = 0.001 * Math.pow(hand_size, 2) + hand_size/30


        for (let i = 0; i < hand_size; i++) {
            let card = this.hand[i]

            let hover_above_or_below = 0
            if (this.hovering_card_index != null) {
                if (i > this.hovering_card_index) {
                    hover_above_or_below = 1
                } if (i < this.hovering_card_index) {
                    hover_above_or_below = -1
                }
            } 

            let hand_ratio = 0.5
            if (hand_size > 1) {
                hand_ratio = i / (hand_size-1)
            }
            
            card.position.x = this.hand_x_start_pos + i * this.dist_between_cards + screen_width / 6.3
            card.position.y = (Math.abs(hand_ratio - 0.5) * 350) * hand_rotation_ratio + (screen_height/4) * 3
            card.rotation = hand_ratio * hand_rotation_ratio - hand_rotation_ratio/2

            card.hand_ratio = hand_ratio
        }
    }

    drawCards(num) {
        console.log(`drawing ${num} cards`)
        function _drawCard(self) {
            if (self.deck_pile.length == 0) return
            if (self.hand.length >= self.constants.max_hand_size) return
            
            let card = self.deck_pile.pop()

            // if the hand already contains this new card
            if (self.hand.some(e => e == card)) {
                _drawCard(self)
            } else {
                card.processing = true
                self.hand.push(card)
            }
        }

        for (let i = 0; i < num; i++) {
            if (this.deck_pile.length == 0) {
                this.deck_pile = this.discard_pile
                this.discard_pile = []
                shuffleArray(this.deck_pile)
            }
            
            _drawCard(this)
        }

        this.renderHand()
    }

    discardHand() {
        this.hand.forEach(card => {
            card.processing = false
            this.discard_pile.push(card)
        })

        this.hand = []
    }

    fightStart() {
        this.deck_pile = this.deck
    }

    turnStart() {
        console.log("sick i can do things")
        this.energy = this.MAX_ENERGY

        this.drawHand()
    }
    
    turnEnd() {
        this.hand.forEach(card => {
            card.cleanDragingCard()
        })
        
        this.discardHand()
        this.renderHand()
    }

    async tick() {
        this.genericEntityTick()
        
        global.player.hand.forEach(card => {
            card.tick()
        });

        if (this.display_HP > this.HP) {
            const difference = Math.abs(this.HP - this.display_HP)
            this.display_HP -= (difference / 350) * global.delta_time + 0.03
        }

        this.drawHealthBar()
        this.drawEnergyWheel(ctx)
        this.renderHand()

        // if (global.frames_processed % 70 == 0) {
        //     this.drawCards(1)
        // }

        // console.log("-----")

        // console.log(this.play_queue)
        // console.log(this.playing)
        // console.log(this.play_cooldown)
        
        this.play_queue.forEach((card) => {
            call_deferred(card, "cleanDragingCard")
        })

        this.play_cooldown -= 1
        if (this.play_queue.length >= 1) {
            if (this.play_cooldown < 0) {
                if (this.playing != null) {
                    console.log("this.playing wasn't set to null, reseting it")
                    this.playing = null
                }

                this.playing = this.play_queue.shift();

                if (this.energy >= this.playing.energy_cost) {
                    this.energy -= this.playing.energy_cost
                    this.playing.play()
                    this.hand = this.hand.filter((card) => card != this.playing)
                                    
                    this.playing.processing = false
                    this.discard_pile.push(this.playing);
                    
                    this.playing = null


                }
                
                // render hand MUST be before the dispatchEvent call
                call_deferred(this, "renderHand")
                call_deferred(ctx.canvas, "dispatchEvent", [event]);

                this.play_cooldown = 20
            }
        }

    }
}