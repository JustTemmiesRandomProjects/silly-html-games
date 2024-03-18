import { global } from "../../global.js"
import { Entity } from "../baseEntity.js"

export class MiscRoom extends Entity {
    constructor() {
        super({})
        
    }

    tick() {
        global.setRoomType("combat")
    }
}