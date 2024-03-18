import { sleep } from "../../tems_library/tems_library.js"
import { Entity } from "../baseEntity.js"

export class CombatRoom extends Entity {
    constructor() {
        super({})
        
        this.turn_count = 0
        this.enemies = []
        
        this.PHASES = {
            "playerStart": this._playerStart,
            "playerControl": this._playerControl,
            "playerEnd": this._playerEnd,
            "enemyStart": this._enemyStart,
            "enemyControl": this._enemyControl,
            "enemyEnd": this._enemyEnd,
        }

        this.phase = this.PHASES["playerStart"]
        this.phase()
    }
    
    end_turn() {
        this.phase = this.PHASES["playerEnd"]
    }

    async _setPhase(phase) {
        this.phase = this.PHASES[phase]

        await sleep(200)

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