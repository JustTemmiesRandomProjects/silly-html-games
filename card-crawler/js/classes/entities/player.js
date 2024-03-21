import { randFloat, randInt, canvas_centre, drawWithScreenWrap } from "../../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../../global.js"
import { Entity } from "../baseEntity.js";

export class Player extends Entity {
    constructor() {
        super()

        this.hand = []
        this.deck = []

        this.deck_pile = []
        this.discard_pile = []
    }


    tick() {
        // console.log(this.hand)
    }

    turnStart() {

    }
}