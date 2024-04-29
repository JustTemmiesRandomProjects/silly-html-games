import { AttackCard } from "../../../classes/parents/card_types/attack.js"
import { helpers } from "../../../helpers.js"

export class ThunderclapCard extends AttackCard {
    constructor() {
        super()

        this.name = "Thunderclap"
        this.description = "Deal 13 damage to ALL enemies."
        this.energy_cost = 2

        this.play = function() {
            helpers.card_helper.damageAllEnemies(13)
        }

        this.register()
    }
}