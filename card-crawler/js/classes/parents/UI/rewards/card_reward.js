import { full_card_list } from "../../../../managers/card_manager.js"
import { randInt } from "../../../../tems_library/tems_library.js"
import { CombatReward } from "../combat_reward.js"

export class CardReward extends CombatReward {
    constructor(position, size, ctx) {
        super(position, size, ctx)

        this.text = "Card Reward!"

        const self = this
        this.handleUIClick = function() {
            self.combat_reward_screen.focused_reward = new full_card_list[randInt(0, full_card_list.length)]
        }
    }
}

