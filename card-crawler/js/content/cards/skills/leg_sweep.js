import { TargetSkillCard } from "../../../classes/parents/card_types/target_skill.js"

export class LegSweepCard extends TargetSkillCard {
    constructor() {
        super()

        this.name = "Leg Sweep"
        this.description = "Gain 10 block, Apply 2 weak to an enemy"
        
        this.register()
    }
}