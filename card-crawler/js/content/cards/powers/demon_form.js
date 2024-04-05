import { PowerCard } from "../../../classes/parents/card_types/power.js"

export class DemonFormCard extends PowerCard {
    constructor() {
        super()

        this.name = "Power Power!!"
        this.description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."

        this.register()
    }
}