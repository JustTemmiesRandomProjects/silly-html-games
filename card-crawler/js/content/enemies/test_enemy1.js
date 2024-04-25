import { Enemy } from "../../classes/entities/enemy.js"
import { EnemyAction } from "../../classes/parents/enemy_actions.js"
import { global } from "../../global.js"
import { helpers } from "../../helpers.js"
import { setRoomType } from "../../managers/room_manager.js"
import { randInt } from "../../tems_library/tems_library.js"

export class TestEnemy1 extends Enemy {
    constructor(pos, size) {
        if (pos == undefined) pos = {x: 970, y:180}
        if (size == undefined) size = {x: 180, y:180}
        super(
            pos,
            size
        )

        this.name = "Debug Enemy 1"
        this.MAX_HP = randInt(5, 3)
        // this.MAX_HP = randInt(72, 17)
        
        this.actions = [
            new EnemyAction(
                ["damage", 6]
            ),
            new EnemyAction(
                ["damage", 15]
            ),
            new EnemyAction(
                ["defend", 12]
            ),
            new EnemyAction(
                ["buff", 1],
                function() {
                    
                }
            ),
            new EnemyAction(
                ["other", 1],
                function() {
                    setRoomType("combat")
                }
            )
        ]

        this.register()
    }
}