import { randFloat, randInt, canvas_centre, drawWithScreenWrap, shuffleArray } from "../../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../../global.js"
import { Entity } from "../baseEntity.js";

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
                    this.play_cooldown = 60
                }
            }
        } else if (this.play_cooldown < 20) {
            this.playing = null
        }
    }

    drawHand() {
        shuffleArray(this.deck_pile)
        let cards_to_draw = 5
        for (let i = 0; i < cards_to_draw; i++) {
            this.drawCard()
        }

        console.log(this.hand)
        console.log(`current hand: ${this.hand.length}`)
        console.log(`current deck: ${this.deck_pile.length}`)
        console.log(`current discard_pile: ${this.discard_pile.length}`)

        for (let i = 0; i < this.hand.length; i++) {
            let card = this.hand[i]
            card.position.x = (1000 / this.hand.length) * (i+1) + 260
            card.position.y = (ctx.canvas.height/4) * 3 - card.size.x/2
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
        this.drawHand()
    }

    turnEnd() {
        this.discardHand()
    }
}