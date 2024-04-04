import { randFloat, randInt, canvas_centre, drawWithScreenWrap, shuffleArray } from "../../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../../global.js"
import { Entity } from "../baseEntity.js";
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
            max_distance_between_cards: 175,
            max_hand_width: (ctx.canvas.width / 6) * 3.3
        }  
    }


    tick() {
        global.player.hand.forEach(card => {
            card.tick()
        });

        // console.log("-----")

        // console.log(this.play_queue)
        // console.log(this.playing)
        // console.log(this.play_cooldown)
        
        this.play_cooldown -= 1
        if (this.playing == null) {
            if (this.play_cooldown < 0) {
                if (this.play_queue.length >= 1) {
                    this.playing = this.play_queue.shift()
                    this.playing.play()
                    this.play_cooldown = 5
                    this.hand = this.hand.filter((card) => card != this.playing)
                    this.renderHand()
                }
            }
        } else if (this.play_cooldown < 20) {
            this.playing = null
        }
    }

    drawHand() {
        shuffleArray(this.deck_pile)
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
        
        function width_curve(x) {
            // const hand_width = Math.log((hand_size/4)+0.8) / Math.log(1.0025)
            // function * const + offset
            return (x * 2 - 1)
        }

        const dist_between_cards = Math.min(
            Math.min(
                hand_size * 200,
                this.constants.max_hand_width
            ) / hand_size,
            // cap it at the actual max hand size
            this.constants.max_distance_between_cards)
        const horizontal_space = dist_between_cards * hand_size


        const x_start_pos = (screen_width - horizontal_space) / 2

        console.log(dist_between_cards, horizontal_space, x_start_pos, screen_width, hand_size * dist_between_cards + x_start_pos, screen_width-x_start_pos)

        const card_y_position_constant = [screen_height / 50, 0, 0, screen_height / 50]
        const card_rotation_constants = [-1, 1, -1, 1]

        for (let i = 0; i < hand_size; i++) {
            let card = this.hand[i]

            let hand_ratio = 0.5
            if (hand_size > 1) {
                hand_ratio = i / (hand_size-1) 
            }
            
            card.position.x = x_start_pos + i * dist_between_cards - card.size.x / 4
            // card.position.y = (screen_height/4) * 2.5
            card.position.y = bezierCurvePointAxis(hand_ratio, card_y_position_constant) - card.size.y/2 + (screen_height/4) * 3
            card.rotation = bezierCurvePointAxis(hand_ratio, card_rotation_constants) * 0.1
            // console.log(bezierCurvePointAxis(hand_ratio, card_y_position_constant))
            card.hand_ratio = hand_ratio
            // console.log(card.rotation)


            // 360 is left boundry, 1560 is right boundry
            // 1200 or 600 is the amplitude, 960 is the centre
            // console.log(card.position.x)
        }
    }

    drawCards(num) {
        function drawCard(self) {
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
            
            drawCard(this)
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