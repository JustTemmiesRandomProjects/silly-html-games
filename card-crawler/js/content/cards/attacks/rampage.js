import { AttackCard } from "../../../classes/parents/card_types/attack.js"
import { TargetAttackCard } from "../../../classes/parents/card_types/target_attack.js"
import { global } from "../../../global.js"
import { helpers } from "../../../helpers.js"
import { splitTextToFit } from "../../../misc.js"
import { randInt } from "../../../tems_library/tems_library.js"

export class RampageCard extends TargetAttackCard {
    constructor() {
        super()

        this.name = "Rampage"
        this.description = "Deal 2 damage. Increase this card's damage by 2 PERMANENTLY."
        this.damage = 2

        this.play = function() {
            helpers.card_helper.damageEnemy(this.damage, this.targeting_enemy)
            this.damage += 2

            this.description = `Deal ${this.damage} damage. Increase this card's damage by 2 PERMANENTLY.`
            this.generateDisplayDescription()
        }

        this.register()
    }
}