import { TargetAttackCard } from "../../../classes/parents/card_types/target_attack.js"
import { global } from "../../../global.js"
import { helpers } from "../../../helpers.js"

export class PommelStrikeCard extends TargetAttackCard {
    constructor() {
        super()

        this.name = "Pommel"
        this.description = "Deal 7 damage. Draw a card."

        this.play = function() {
            helpers.card_helper.damageEnemy(7, this.targeting_enemy)
            global.player.drawCards(1)
        }

        this.register()
    }
}