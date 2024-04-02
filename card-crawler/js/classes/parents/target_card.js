import { global, ctx, inputManager } from "../../global.js"
import { Card } from "./card.js";

export class TargetCard extends Card {
    constructor(colour) {
        super(colour)
    }
}