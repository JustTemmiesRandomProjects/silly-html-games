import { ctx } from "../../../global.js";
import { PowerCard } from "../../parents/card_types/power.js";

export class TerrorCard extends PowerCard {
    constructor() {
        super()

        this.name = "Terror"

        this.postSetup()
    }
}