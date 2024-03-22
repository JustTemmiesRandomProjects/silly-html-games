import { ctx } from "../../../global.js";
import { AttackCard } from "../../parents/card_types/attack.js";

export class StrikeCard extends AttackCard {
    constructor() {
        super()

        this.name = "Strike"
        this.description = "Deal 6 damage"

        this.postSetup()
    }
}