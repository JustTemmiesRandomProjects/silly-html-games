import { SkillCard } from "../../../classes/parents/card_types/skill.js"
import { global } from "../../../global.js"
import { helpers } from "../../../helpers.js"

export class BloodlettingCard extends SkillCard {
    constructor() {
        super()

        this.name = "Bloodletting"
        this.description = "Lose 5 HP. Gain 2 energy."

        this.energy_cost = 0

        this.play = function() {
            global.player.HP -= 5
            global.player.energy += 2
        }

        this.register()
    }
}