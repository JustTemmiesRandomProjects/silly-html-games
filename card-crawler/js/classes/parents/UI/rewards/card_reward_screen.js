import { ctx, global, hudCtx } from "../../../../global.js";
import { full_card_list } from "../../../../managers/card_manager.js";
import { splitTextToFit } from "../../../../misc.js";
import { drawSquircle } from "../../../../tems_library/rendering.js";
import { randInt } from "../../../../tems_library/tems_library.js";
import { Entity } from "../../baseEntity.js";

export class CardRewardScreen extends Entity {
    constructor(parent) {
        super()

        this.card_scenes = [
            new full_card_list[randInt(0, full_card_list.length)],
            new full_card_list[randInt(0, full_card_list.length)],
            new full_card_list[randInt(0, full_card_list.length)],
            new full_card_list[randInt(0, full_card_list.length)],
        ]

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
                console.log("adding :3")
                global.player.discard_pile.push(card)
                self.card_scenes.forEach((local_card) => {
                    local_card.UIExit()
                    local_card.processing = false
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
        this.card_scenes.forEach((card) => {
            hudCtx.translate(
                card.position.x,
                card.position.y
            )

            // border
            drawSquircle(hudCtx, -3, -3, card.size.x+6, card.size.y+6, 19, "#102f10")        
            
            // background
            drawSquircle(hudCtx, 0, 0, card.size.x, card.size.y, 16, card.colour)
            

            card.drawEnergyCost(hudCtx)
            card.drawText(hudCtx)

            hudCtx.setTransform(1, 0, 0, 1, 0, 0)
        })
    }
}

