import { randFloat, randInt, canvas_centre, drawWithScreenWrap } from "../tems_library/tems_library.js"
import { global, ctx, inputManager } from "../global.js"

export class Entity {
    constructor() {
        this.ID = global.entity_counter
        global.entity_counter ++
    }

    tick() {}
}