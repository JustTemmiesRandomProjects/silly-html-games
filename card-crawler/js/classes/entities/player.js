import { randFloat, randInt, canvas_centre, drawWithScreenWrap, shuffleArray } from "../../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../../global.js"
import { Entity } from "../parents/baseEntity.js";
import { bezierCurvePointAxis } from "../../tems_library/math.js";

export class Player extends Entity {
    constructor() {
        super()

        this.hand = []
        this.deck = []

        this.deck_pile = []
        this.discard_pile = []

        this.playing = null
        this.play_cooldown = 0
        this.play_queue = []

        this.constants = {
            draw_amount: 4,
            max_hand_size: 10,
            max_distance_between_cards: 210,
            max_hand_width: (ctx.canvas.width / 6) * 3.3
        }  
    }


    tick() {
        global.player.hand.forEach(card => {
            card.tick()
        });

        // if (global.frames_processed % 70 == 0) {
        //     this.drawCards(1)
        // }

        // console.log("-----")

        // console.log(this.play_queue)
        // console.log(this.playing)
        // console.log(this.play_cooldown)
        
        this.play_cooldown -= 1
        if (this.play_queue.length >= 1) {
            if (this.play_cooldown < 0) {
                if (this.playing != null) {
                    console.log("this.playing wasn't set to null, reseting it")
                    this.playing = null
                }

                this.playing = this.play_queue.shift();
                this.playing.play();
                                
                this.playing.processing = false
                this.discard_pile.push(this.playing);
                
                this.hand = this.hand.filter((card) => card != this.playing)
                this.playing = null

                // this.play_cooldown = 60

                this.renderHand()
            }
        }
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
        
        const dist_between_cards = Math.min(
            Math.min(
                hand_size * 200,
                this.constants.max_hand_width
            ) / hand_size,
            // cap it at the actual max hand size
            this.constants.max_distance_between_cards
        )

        const horizontal_space = dist_between_cards * hand_size
        const x_start_pos = (screen_width - horizontal_space) / 2

        const hand_rotation_ratio = 0.001 * Math.pow(hand_size, 2) + hand_size/30


        for (let i = 0; i < hand_size; i++) {
            let card = this.hand[i]

            let hand_ratio = 0.5
            if (hand_size > 1) {
                hand_ratio = i / (hand_size-1) 
            }

            card.position.x = x_start_pos + i * dist_between_cards + screen_width / 5 - ((screen_width / 140) * hand_size) 
            card.position.y = (Math.abs(hand_ratio - 0.5) * 350) * hand_rotation_ratio + (screen_height/4) * 2.85
            card.rotation = hand_ratio * hand_rotation_ratio - hand_rotation_ratio/2

            card.hand_ratio = hand_ratio
        }
    }

    drawCards(num) {
        function _drawCard(self) {
            if (self.deck_pile.length == 0) return
            if (self.hand.length >= self.constants.max_hand_size) return
            
            let card = self.deck_pile.pop()
            card.processing = true
            self.hand.push(card)
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

    turnStart() {
        console.log("sick i can do things")
        this.discardHand()
        this.drawHand()
    }

    turnEnd() {
        
    }
}