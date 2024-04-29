import { AttackCard } from "../../../classes/parents/card_types/attack.js"
import { TargetAttackCard } from "../../../classes/parents/card_types/target_attack.js"
import { global } from "../../../global.js"
import { helpers } from "../../../helpers.js"
import { randInt } from "../../../tems_library/tems_library.js"

export class BatterCard extends TargetAttackCard {
    constructor() {
        super()

        this.name = "Batter"
        this.description = "Deal 2 damage to an enemy 4 times."

        this.play = function() {
            for (let i = 0; i < 4; i ++) {
                helpers.card_helper.damageEnemy(2, this.targeting_enemy)
            }
        }

        this.register()
    }
}