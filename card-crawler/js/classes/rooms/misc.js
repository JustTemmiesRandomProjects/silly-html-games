import { global } from "../../global.js"
import { BaseRoom } from "./baseRoom.js"

export class MiscRoom extends BaseRoom {
    constructor() {
        super({})
        
    }

    tick() {
        global.setRoomType("combat")
    }
}