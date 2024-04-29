import { AttackCard } from "../../../classes/parents/card_types/attack.js"
import { TargetAttackCard } from "../../../classes/parents/card_types/target_attack.js"
import { global } from "../../../global.js"
import { helpers } from "../../../helpers.js"
import { splitTextToFit } from "../../../misc.js"
import { randInt } from "../../../tems_library/tems_library.js"

export class ReaperCard extends AttackCard {
    constructor() {
        super()

        this.name = "Reaper"
        this.description = "Deal 4 damage to ALL enemies. Heal HP equal to damage dealt."
        this.energy_cost = 2

        this.play = function() {
            global.current_room.enemies.forEach((enemy) => {
                helpers.card_helper.healPlayer(Math.min(4, enemy.HP))
                helpers.card_helper.damageEnemy(4, enemy)
            })
        }

        this.register()
    }
}