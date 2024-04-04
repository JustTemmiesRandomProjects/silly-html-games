import { TargetPowerCard } from "../../../classes/parents/card_types/target_power.js"

export class TerrorCard extends TargetPowerCard {
    constructor() {
        super()

        this.name = "Terror"
        
        this.play = function() {
            console.log("nuh uh!!")
        }

        this.register()
    }
}