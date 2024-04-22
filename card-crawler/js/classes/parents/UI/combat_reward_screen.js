import { ctx, hudCtx } from "../../../global.js";
import { drawSquircle } from "../../../tems_library/rendering.js";
import { randInt } from "../../../tems_library/tems_library.js";
import { UIElement } from "../UI_element.js";
import { CombatReward } from "./combat_reward.js";

export class CombatRewardScreen extends UIElement {
    constructor(rewards) {
        const width = ctx.canvas.width
        const height = ctx.canvas.height
        const rect_width = width / 3.5
        const rect_height = height / 1.6
        const x_offset = (width - rect_width) / 2 + width / 8
        const y_offset = (height - rect_height) / 2
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

        this.rewards_scenes = []

        let i = 0
        const reward_height = 120
        const reward_margin = 25
        const initial_top_margin = 60
        rewards.forEach((reward) => {
            const new_rect_width = rect_width * 0.8
            const new_rect_height = rect_height * 0.8
            this.rewards_scenes.push(
                new reward(
                    {
                        x: x_offset + (rect_width - new_rect_width) / 2,
                        y: y_offset + (reward_height + reward_margin) * i + initial_top_margin
                    },
                    {x: new_rect_width, y: reward_height},
                    hudCtx
                )
            )
            i ++
        })
    }

    draw() {
        // darken the rest of the screen
        hudCtx.fillStyle="#1f0f1faf";
        hudCtx.fillRect(0, 0, hudCtx.canvas.width, hudCtx.canvas.height)
        
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
        this.rewards_scenes.forEach((reward) => {
            reward.tick()
        })

        hudCtx.restore()
    }

    tick() {
        this.draw()
    }
}

