import { ctx, global } from "../../global.js";
import { sleep } from "../../tems_library/tems_library.js"
import { BaseRoom } from "./baseRoom.js"
import { EndTurnButton } from "../scenes/pre_made_elements/buttons/end_turn_button.js";
import { full_enemy_list } from "../../managers/enemy_manager.js";

export class CombatRoom extends BaseRoom {
    constructor() {
        super()
    
        this.turn_count = 0

        this.phase = this.PHASES["playerStart"]
        this.phase()

        let button = new EndTurnButton(this)
        global.entities["hud"].push(button)

        global.player.deck_pile = global.player.deck
    }
    
    register() {
        if (this.enemies == undefined) {
            console.debug("no enemies were found, adding debug enemies")
            this.enemies = []
            this.enemies.push(new full_enemy_list[0])
            this.enemies.push(new full_enemy_list[1])
        }
        console.log(this.enemies)
    }

    tick() {
        this.enemies.forEach(enemy => {
            enemy.tick()
        });
    }
    
    async end_turn() {
        if (this.phase == this.PHASES["playerControl"]) {
            this.phase = this.PHASES["playerEnd"]
            await this.phase()
        } else {
            console.log("can't end turn, it's not the players' turn yet")
        }
    }

    async _setPhase(phase) {
        this.phase = this.PHASES[phase]

        await sleep(40)

        await this.phase()
    }


    async _playerStart() {
        console.log("player turn starting")

        await this._setPhase("playerControl")
    }
    
    async _playerControl() {
        console.log("player is in control")
        global.player.turnStart()

    }

    async _playerEnd() {
        console.log("player turn ending")
        global.player.turnEnd()

        await this._setPhase("enemyStart")
    }
    
    async _enemyStart() {
        console.log("enemy turn starting")
        
        await this._setPhase("enemyControl")
    }
    
    async _enemyControl() {
        console.log("enemies attacking")
        
        await this._setPhase("enemyEnd")
    }
    
    async _enemyEnd() {
        console.log("enemy turn ending")
        
        await this._setPhase("playerStart")
    }
}