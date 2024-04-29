import { TargetAttackCard } from "../../../classes/parents/card_types/target_attack.js"
import { global } from "../../../global.js"
import { helpers } from "../../../helpers.js"

export class AngerCard extends TargetAttackCard {
    constructor() {
        super()

        this.name = "Anger"
        this.description = "Deal 5 damage. Add a copy of this card into your restock pile."
        this.energy_cost = 0

        this.play = function() {
            helpers.card_helper.damageEnemy(5, this.targeting_enemy)
            global.player.discard_pile.push(new AngerCard)
        }

        this.register()
    }
}