import { SkillCard } from "../../../classes/parents/card_types/skill.js"

export class DefendCard extends SkillCard {
    constructor() {
        super()

        this.name = "Defend"
        this.description = "Gain 5 block"
        
        this.register()
    }
}