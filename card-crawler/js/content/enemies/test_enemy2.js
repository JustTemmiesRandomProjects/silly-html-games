import { Enemy } from "../../classes/entities/enemy.js"
import { global } from "../../global.js"
import { randInt } from "../../tems_library/tems_library.js"

export class TestEnemy2 extends Enemy {
    constructor(pos) {
        super(
            pos,
            {x: 120,  y:120}
        )

        this.name = "Debug Enemy 2"
        this.MAX_HP = randInt(16, 8)

        this.moveset = [
            
        ]

        this.register()
    }
}