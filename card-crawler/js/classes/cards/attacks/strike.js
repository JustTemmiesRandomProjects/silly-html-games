import { ctx } from "../../../global.js";
import { AttackCard } from "../../parents/card_types/attack.js";
import { TargetAttackCard } from "../../parents/card_types/target_attack.js";

export class StrikeCard extends TargetAttackCard {
    constructor() {
        super()

        this.name = "Strike"
        this.description = "Deal 6 damage"

        this.play = function() {
            console.log("Yarg!!")
        }

        this.register()
    }
}