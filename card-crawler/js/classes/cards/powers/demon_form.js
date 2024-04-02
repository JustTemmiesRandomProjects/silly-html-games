import { ctx } from "../../../global.js";
import { PowerCard } from "../../parents/card_types/power.js";

export class DemonFormCard extends PowerCard {
    constructor() {
        super()

        this.name = "Demon Form"
        this.description = "At the start of your turn, gain 2 strength"

        this.register()
    }
}