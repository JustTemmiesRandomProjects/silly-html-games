import { sleep } from "../../tems_library/tems_library.js"
import { Entity } from "../parents/baseEntity.js"

export class BaseRoom extends Entity {
    constructor() {
        super({})
        
        this.PHASES = {
            "playerStart": this._playerStart,
            "playerControl": this._playerControl,
            "playerEnd": this._playerEnd,
            "enemyStart": this._enemyStart,
            "enemyControl": this._enemyControl,
            "enemyEnd": this._enemyEnd,
        }
    }
}