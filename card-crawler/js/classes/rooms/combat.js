import { sleep } from "../../tems_library/tems_library.js"
import { BaseRoom } from "./baseRoom.js"

export class CombatRoom extends BaseRoom {
    constructor() {
        super({})
        
        this.turn_count = 0
        this.enemies = []

        this.phase = this.PHASES["playerStart"]
        this.phase()
    }
    
    end_turn() {
        this.phase = this.PHASES["playerEnd"]
    }

    async _setPhase(phase) {
        this.phase = this.PHASES[phase]

        await sleep(400)

        await this.phase()
    }


    async _playerStart() {
        console.log("player turn starting")

        await this._setPhase("playerControl")
    }
    
    async _playerControl() {
        console.log("player is in control")
        await this._setPhase("playerEnd")
    }

    async _playerEnd() {
        console.log("player turn ending")
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