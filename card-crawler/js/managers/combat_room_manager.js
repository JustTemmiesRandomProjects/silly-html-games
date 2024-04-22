import { TestRoom1 } from "../content/rooms/combat_rooms/test_room1.js"
import { TestRoom2 } from "../content/rooms/combat_rooms/test_room2.js"
import { TestRoom3 } from "../content/rooms/combat_rooms/test_room3.js"
import { randInt } from "../tems_library/tems_library.js"

var full_combat_room_list = []
var last_room = null

export function combatRoomManagerInit(){
    full_combat_room_list.push(TestRoom1)
    full_combat_room_list.push(TestRoom2)
    full_combat_room_list.push(TestRoom3)
}

export function getNewCombatRoom() {
    const new_room = full_combat_room_list[randInt(0, full_combat_room_list.length)]
    if (new_room == last_room) {
        return getNewCombatRoom()
    }

    last_room = new_room
    return new_room
}