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
        let cards_to_draw = 6
        for (let i = 0; i < cards_to_draw; i++) {
            this.drawCard()
        }

        console.log(this.hand)
        console.log(`current hand: ${this.hand.length}`)
        console.log(`current deck: ${this.deck_pile.length}`)
        console.log(`current discard_pile: ${this.discard_pile.length}`)

        this.renderHand()
    }
    
    renderHand() {
        const hand_length = this.hand.length
        const screen_width = ctx.canvas.width
        const screen_height = ctx.canvas.height

        function width_curve(x, hand_length) {
            // const hand_width = Math.log((hand_length/4)+0.8) / Math.log(1.0025)
            // function * const + offset
            return (x * 2 - 1)
                    * ((screen_width/6) * 1.5)
                    + screen_width/2
        }

        const card_y_position_constant = [screen_height / 50, 0, 0, screen_height / 50]
        const card_rotation_constants = [-1, 1, -1, 1]

        for (let i = 0; i < hand_length; i++) {
            let card = this.hand[i]

            let hand_ratio = 0.5
            if (hand_length > 1) {
                hand_ratio = i / (hand_length-1) 
            }
            
            card.position.x = width_curve(hand_ratio, hand_length) - card.size.x/2
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

    drawCard() {
        if (this.deck_pile.length == 0) {
            // return early if both discard and deck piles are empty
            if (this.discard_pile.length == 0) { return }
            this.deck_pile = this.discard_pile
            this.discard_pile = []
            shuffleArray(this.deck_pile)
        }

        let card = this.deck_pile.pop()
        card.processing = true
        this.hand.push(card)
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