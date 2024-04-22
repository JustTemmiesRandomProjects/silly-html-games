import { TargetAttackCard } from "../../../classes/parents/card_types/target_attack.js"
import { helpers } from "../../../helpers.js"

export class StrikeCard extends TargetAttackCard {
    constructor() {
        super()

        this.name = "Strike"
        this.description = "Deal 9 damage"

        this.play = function() {
            helpers.card_helper.damageEnemy(9, this.targeting_enemy)
        }

        this.register()
    }
}