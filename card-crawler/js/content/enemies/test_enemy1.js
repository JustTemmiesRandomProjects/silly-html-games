import { Enemy } from "../../classes/entities/enemy.js"
import { global } from "../../global.js"
import { randInt } from "../../tems_library/tems_library.js"

export class TestEnemy1 extends Enemy {
    constructor() {
        super(
            {x: 970, y:180},
            {x: 180, y:180}
        )

        this.name = "Debug Enemy 1"
        this.MAX_HP = randInt(72, 17)

        this.register()
    }
}