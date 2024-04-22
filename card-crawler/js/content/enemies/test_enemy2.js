import { Enemy } from "../../classes/entities/enemy.js"
import { global } from "../../global.js"
import { EnemyAction } from "../../classes/parents/enemy_actions.js"
import { randInt } from "../../tems_library/tems_library.js"

export class TestEnemy2 extends Enemy {
    constructor(pos, size) {
        if (pos == undefined) pos = {x: 770, y:280}
        if (size == undefined) size = {x: 120, y:120}
        super(
            pos,
            size
        )

        this.name = "Debug Enemy 2"
        this.MAX_HP = randInt(3, 5)

        this.actions = [
            new EnemyAction(
                ["damage", 2]
            ),
            new EnemyAction(
                ["damage", 5]
            )
        ]

        this.register()
    }
}