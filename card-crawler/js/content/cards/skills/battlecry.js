import { SkillCard } from "../../../classes/parents/card_types/skill.js"
import { global } from "../../../global.js"
import { helpers } from "../../../helpers.js"

export class BattlecryCard extends SkillCard {
    constructor() {
        super()

        this.name = "Battlecry"
        this.description = "Lose 2 HP. Draw 4 cards."

        this.energy_cost = 0

        this.play = function() {
            global.player.HP -= 2
            global.player.drawCards(4)
        }

        this.register()
    }
}