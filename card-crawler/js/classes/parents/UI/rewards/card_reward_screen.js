import { ctx, global, hudCtx } from "../../../../global.js";
import { full_card_list } from "../../../../managers/card_manager.js";
import { drawSquircle } from "../../../../tems_library/rendering.js";
import { randInt } from "../../../../tems_library/tems_library.js";
import { SkipCardRewardButton } from "../../../scenes/pre_made_elements/buttons/skip_card_reward_button.js";
import { Entity } from "../../baseEntity.js";
import { Button } from "../button.js";

export class CardRewardScreen extends Entity {
    constructor(parent) {
        super()
        
        this.parent = parent

        this.card_list = []

        while (this.card_list.length < 3) {
            const new_card = full_card_list[randInt(0, full_card_list.length)]
            if (this.card_list.indexOf(new_card) == -1) {
                this.card_list.push(new_card)
            }
        }


        this.card_scenes = []

        let counter = 0
        this.card_list.forEach((card) => {
            const new_card = new card
            new_card.card_reward_ID = counter
            this.card_scenes.push(new_card)

            counter ++
        })
        
        const screen_width = ctx.canvas.width
        const screen_height = ctx.canvas.height
        const card_area = (screen_width / 6.5) * this.card_scenes.length 
        this.size_per_card = card_area / this.card_scenes.length
        this.starting_point = (screen_width - card_area) / 2 + screen_width / 8 + this.card_scenes[0].size.x / 8
        
        let i = 0
        const self = this
        this.card_scenes.forEach((card) => {
            card.position = {
                x: this.starting_point + this.size_per_card * i,
                y: ctx.canvas.height * (6 / 13) - card.size.y / 2
            }
            card.handleUIClick = function() {
                console.log(`adding ${card.name} - ID: ${card.card_reward_ID}`)
                
                const new_card = new self.card_list[card.card_reward_ID]
                new_card.processing = false
                global.player.discard_pile.push(new_card)
                global.player.deck.push(new_card)

                self.closeScreen()
            }
            
            card.handleUIMouseDown = function () {}
            card.handleDragingClick = function () {}

            card.processing = true

            i ++
        })

        // if even amount of cards
        let middle_pos_x = 0
        if (this.card_scenes.length % 2 == 0) {
            const card_1 = this.card_scenes[this.card_scenes.length / 2]
            const card_2 = this.card_scenes[this.card_scenes.length / 2 - 1]
            middle_pos_x = card_1.position.x / 2 + card_1.size.x / 4
            middle_pos_x += card_2.position.x / 2 + card_2.size.x / 4

        } else {
            const middle_card = this.card_scenes[Math.floor(this.card_scenes.length / 2)]
            middle_pos_x  = middle_card.position.x + middle_card.size.x / 2

        }

        const button_size = {x: 260, y: 120}

        this.button = new SkipCardRewardButton(
            {x: middle_pos_x - button_size.x / 2, y: ctx.canvas.height * 0.73},
            button_size,
            this
        )
    }

    closeScreen() {
        this.card_scenes.forEach((local_card) => {
            local_card.UIExit()
            local_card.processing = false
        })
        this.parent.combat_reward_screen.reward_scenes.forEach((reward) => {
            reward.UIExit()
            reward.processing = false
        })

        this.parent.combat_reward_screen.focused_reward = null
    }

    tick() {
        this.genericEntityTick()
        this.card_scenes.forEach((card) => {
            if (card.hovering) {
                card.miliseconds_focused += global.delta_time
                card.miliseconds_focused = Math.min(70, card.miliseconds_focused)
            } else {
                card.miliseconds_focused -= global.delta_time * 2
                card.miliseconds_focused = Math.max(0, card.miliseconds_focused)
            }

            card.drawReward(hudCtx)
        })

        this.button.tick()
    }
}

