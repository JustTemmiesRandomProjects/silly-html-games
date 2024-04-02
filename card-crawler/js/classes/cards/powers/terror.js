import { ctx } from "../../../global.js";
import { PowerCard } from "../../parents/card_types/power.js";
import { TargetPowerCard } from "../../parents/card_types/target_power.js";

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