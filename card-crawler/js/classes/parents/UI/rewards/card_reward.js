import { global } from "../../../../global.js"
import { full_card_list } from "../../../../managers/card_manager.js"
import { randInt } from "../../../../tems_library/tems_library.js"
import { CombatReward } from "../combat_reward.js"
import { CardRewardScreen } from "./card_reward_screen.js"

export class CardReward extends CombatReward {
    constructor(position, size, ctx) {
        super(position, size, ctx)

        this.text = "Card Reward!"

        const self = this
        this.handleUIClick = function() {
            if (self.processing) {
                console.log("card reward activated!")
                self.processing = false
                self.combat_reward_screen.focused_reward = new CardRewardScreen(self)
                self.combat_reward_screen.reward_scenes = self.combat_reward_screen.reward_scenes.filter((reward) => reward != self)
            }
        }
    }
}

