import { AttackCard } from "../../../classes/parents/card_types/attack.js"

export class ThunderclapCard extends AttackCard {
    constructor() {
        super()

        this.name = "Die"
        this.description = "Kill all enemies"

        this.register()
    }
}