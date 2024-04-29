import { TargetAttackCard } from "../../../classes/parents/card_types/target_attack.js"
import { global } from "../../../global.js"
import { helpers } from "../../../helpers.js"

export class HemokinisisCard extends TargetAttackCard {
    constructor() {
        super()

        this.name = "Hemokinisis"
        this.description = "Lose 3 HP. Deal 15 damage."
        this.energy_cost = 0

        this.play = function() {
            global.player.HP -= 3
            helpers.card_helper.damageEnemy(15, this.targeting_enemy)
        }

        this.register()
    }
}