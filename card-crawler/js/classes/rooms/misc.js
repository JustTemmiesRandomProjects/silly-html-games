import { global } from "../../global.js"
import { setRoomType } from "../../managers/room_manager.js"
import { BaseRoom } from "./baseRoom.js"

export class MiscRoom extends BaseRoom {
    constructor() {
        super()
        
    }

    tick() {
        setRoomType("combat")
    }
}