import { CombatReward } from "../combat_reward.js"

export class CardReward extends CombatReward {
    constructor(position, size, ctx) {
        super(position, size, ctx)

        this.text = "Card Reward!"
    }
}

