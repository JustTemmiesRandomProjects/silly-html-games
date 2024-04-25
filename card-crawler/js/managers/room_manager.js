import { MiscRoom } from "../classes/rooms/misc.js"
import { global } from "../global.js"
import { getNewCombatRoom } from "./combat_room_manager.js"

export function setRoomType(room_type) {
    const ROOM_TYPES = [
        "combat",
        "misc",
    ]

    global.player.focused_card_state = null

    if (room_type == "combat") {
        const new_room_type = getNewCombatRoom()
        global.current_room = new new_room_type

    } else if (room_type == "misc") {
        global.current_room = new MiscRoom
    }
}