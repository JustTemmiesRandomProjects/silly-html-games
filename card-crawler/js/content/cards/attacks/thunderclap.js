import { AttackCard } from "../../../classes/parents/card_types/attack.js"

export class ThunderclapCard extends AttackCard {
    constructor() {
        super()

        this.name = "Die"
        this.description = "Deal 13 damage to all enemies"

        this.play = function() {
            this.card_helper.damageAllEnemies(13)
        }

        this.register()
    }
}