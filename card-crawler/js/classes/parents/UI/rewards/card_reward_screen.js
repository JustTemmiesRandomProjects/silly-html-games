import { ctx, global, hudCtx } from "../../../../global.js";
import { full_card_list } from "../../../../managers/card_manager.js";
import { splitTextToFit } from "../../../../misc.js";
import { drawSquircle } from "../../../../tems_library/rendering.js";
import { randInt } from "../../../../tems_library/tems_library.js";
import { Entity } from "../../baseEntity.js";

export class CardRewardScreen extends Entity {
    constructor(parent) {
        super()
        
        this.card_list = [
            full_card_list[randInt(0, full_card_list.length)],
            full_card_list[randInt(0, full_card_list.length)],
            full_card_list[randInt(0, full_card_list.length)],
            full_card_list[randInt(0, full_card_list.length)],
        ]

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

                self.card_scenes.forEach((local_card) => {
                    local_card.UIExit()
                    local_card.processing = false
                })
                parent.combat_reward_screen.reward_scenes.forEach((reward) => {
                    reward.UIExit()
                    reward.processing = false
                })

                parent.combat_reward_screen.focused_reward = null
            }
            
            card.handleUIMouseDown = function () {}
            card.handleDragingClick = function () {}

            card.processing = true

            i ++
        })
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
    }
}

