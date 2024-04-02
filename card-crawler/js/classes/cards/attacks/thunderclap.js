import { ctx } from "../../../global.js";
import { AttackCard } from "../../parents/card_types/attack.js";

export class ThunderclapCard extends AttackCard {
    constructor() {
        super()

        this.name = "Thunderclap"
        this.description = "Deal 10 damage to all enemies"

        this.register()
    }
}