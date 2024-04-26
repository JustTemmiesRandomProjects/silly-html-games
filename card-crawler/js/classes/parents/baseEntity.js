import { global, ctx, inputManager } from "../../global.js"

export class Entity {
    constructor() {
        this.ID = global.entity_counter
        global.entity_counter ++
    }

    tick() {}

    genericEntityTick() {
        global.loaded_entities ++
    }
}