import { ctx, hudCtx } from "../../../global.js";
import { drawSquircle } from "../../../tems_library/rendering.js";
import { randInt } from "../../../tems_library/tems_library.js";
import { ProceedButton } from "../../scenes/pre_made_elements/buttons/proceed_button.js";
import { UIElement } from "../UI_element.js";
import { CombatReward } from "./combat_reward.js";

let width
let height
let rect_width
let rect_height
let x_offset
let y_offset

let reward_height
let reward_margin
let initial_top_margin

export class CombatRewardScreen extends UIElement {
    constructor(rewards) {
        width = ctx.canvas.width
        height = ctx.canvas.height
        rect_width = width / 3.5
        rect_height = height / 1.6
        x_offset = (width - rect_width) / 2 + width / 8
        y_offset = (height - rect_height) / 2
        super(
            {x: x_offset, y: y_offset},
            {x: rect_width, y: rect_height}
        )

        const valid_titles = [
            "Spoils!", "Loot!",
            "Rewards!", "Prizes!"
        ]

        // this.hover_colour = "#bbcbc0"
        this.standard_colour = "#3f443f"
        this.text_colour = "#dfe8df"
        this.text = valid_titles[randInt(0, valid_titles.length)]
        this.font = "kalam-bold"
        this.font_size = 64

        this.reward_scenes = []
        this.focused_reward = null
        this.proceed_button = new ProceedButton(this)


        let i = 0
        reward_height = 120
        reward_margin = 25
        initial_top_margin = 60
        const self = this
        rewards.forEach((reward) => {
            this.reward_scenes.push(
                new reward(
                    this.getRewardPos(i, height),
                    {x: rect_width * 0.8, y: reward_height},
                    hudCtx
                )
            )
            i ++
        })

        this.reward_scenes.forEach((reward) => {
            reward.combat_reward_screen = this
        })
    }

    getRewardPos(i) {
        return {
            x: Math.floor(x_offset + rect_width / 10),
            y: Math.floor(y_offset + (reward_height + reward_margin) * i + initial_top_margin)
        }
    }

    drawBackground() {
        // darken the rest of the screen
        hudCtx.fillStyle="#1f0f1faf";
        hudCtx.fillRect(0, 0, hudCtx.canvas.width, hudCtx.canvas.height)
    }

    drawRewards() {
        // draw the reward background
        hudCtx.save()
        hudCtx.translate(this.position.x, this.position.y)
        
        hudCtx.font = `${this.font_size}px ${this.font}`;
        hudCtx.textAlign = 'center';
        hudCtx.textBaseline = 'middle';
        hudCtx.fillStyle = this.text_colour;
        hudCtx.fillText(
            this.text,
            this.size.x / 2, -this.size.y / 12,
        );
        
        drawSquircle(hudCtx, 0, 0, this.size.x, this.size.y, 24, this.standard_colour)
        hudCtx.clip()
        hudCtx.setTransform(1, 0, 0, 1, 0, 0)
        
        // reset the mask back and transforms back
        this.reward_scenes.forEach((reward) => {
            reward.tick()
        })
        
        
        hudCtx.restore()
    }

    tick() {
        this.genericEntityTick()
        this.drawBackground()
        
        this.reward_scenes.forEach((reward) => {
            reward.processing = (this.focused_reward == null)
        })
        
        if (this.focused_reward != null) {
            this.reward_scenes.forEach((reward) => {
                reward.UIExit()
            })
            
            this.focused_reward.tick()
            
        } else {
            let i = 0
            this.reward_scenes.forEach((reward) => {
                reward.position = this.getRewardPos(i)
                i ++
            })
            
            this.drawRewards()
            this.proceed_button.tick()
        }

    }
}

