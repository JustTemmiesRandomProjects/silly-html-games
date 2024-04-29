import { ctx, global } from "../../global.js";
import { sleep } from "../../tems_library/tems_library.js"
import { BaseRoom } from "./baseRoom.js"
import { EndTurnButton } from "../scenes/pre_made_elements/buttons/end_turn_button.js";
import { full_enemy_list } from "../../managers/enemy_manager.js";
import { Button } from "../parents/UI/button.js";
import { CombatRewardScreen } from "../parents/UI/combat_reward_screen.js";
import { CardReward } from "../parents/UI/rewards/card_reward.js";

export class CombatRoom extends BaseRoom {
    constructor() {
        super()
    
        this.turn_count = 0
        this.enemy_action_queue = []
        this.time_since_last_attack = 0

        this.end_turn_button = new EndTurnButton(this)

        this.reward = null
    }
    
    register() {
        if (this.enemies == undefined) {
            console.debug("no enemies were found, adding debug enemies")
            this.enemies = []
            this.enemies.push(new full_enemy_list[0])
            this.enemies.push(new full_enemy_list[1])
        }

        global.player.fightStart()

        this.phase = this.PHASES["playerStart"]
        this.phase()

    }

    async tick() {
        this.genericEntityTick()
        if (this.enemies.length == 0 && this.reward == null) {
            console.log("you win, yay")
            this.reward = new CombatRewardScreen([
                CardReward,
                CardReward,
                CardReward,
            ])
            await this._setPhase("playerEnd")
        } else {
            this.enemies.forEach(enemy => {
                enemy.tick()
            });
        }

        if (this.enemy_action_queue.length > 0) {
            const enemy = this.enemy_action_queue[0]
            const action = enemy.active_action

            this.time_since_last_attack += global.delta_time
            if (this.time_since_last_attack > 400) {
                this.time_since_last_attack = -200
                action.intent_function()

                this.enemy_action_queue = this.enemy_action_queue.filter((temp_enemy) => temp_enemy != enemy)
                enemy.active_action = null
            }
        } else if (this.phase_name == "enemyEnd") {
            await this._setPhase("playerStart")
        }

        if (this.reward != null) {
            this.reward.tick()
            this.end_turn_button.processing = false
        } else {
            this.end_turn_button.tick()
            this.end_turn_button.processing = true
        }
    }
    
    async end_turn() {
        console.log("ending turn...")
        console.log(this.phase_name)
        if (this.phase_name == "playerControl") {
            await this._setPhase("playerEnd")
            await this.phase()
        } else {
            console.log("can't end turn, it's not the players' turn yet")
        }
    }

    async _setPhase(phase) {
        this.phase = this.PHASES[phase]
        this.phase_name = phase

        await sleep(40)

        await this.phase()
    }


    async _playerStart() {
        console.log("player turn starting")

        this.enemies.forEach(enemy => {
            enemy.selectNewAction()
        })

        await this._setPhase("playerControl")
    }
    
    async _playerControl() {
        console.log("player is in control")

        
        global.player.turnStart()
    }

    async _playerEnd() {
        console.log("player turn ending")
        global.player.turnEnd()

        if (this.reward == null) {
            await this._setPhase("enemyStart")
        }
    }
    
    async _enemyStart() {
        console.log("enemy turn starting")
        
        await this._setPhase("enemyControl")
    }
    
    async _enemyControl() {
        console.log("enemies attacking")

        this.enemies.forEach((enemy) => {
            this.enemy_action_queue.push(enemy)
        })
        
        await this._setPhase("enemyEnd")
    }
    
    async _enemyEnd() {
        console.log("enemy turn ending")
        
        // phase changed in tick() function
    }
}