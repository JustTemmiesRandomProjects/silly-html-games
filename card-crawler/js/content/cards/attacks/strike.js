import { TargetAttackCard } from "../../../classes/parents/card_types/target_attack.js"

export class StrikeCard extends TargetAttackCard {
    constructor() {
        super()

        this.name = "Strike"
        this.description = "Deal 6 damage"

        this.register()
    }
}