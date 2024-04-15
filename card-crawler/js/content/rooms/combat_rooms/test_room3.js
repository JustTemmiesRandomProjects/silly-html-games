import { CombatRoom } from "../../../classes/rooms/combat.js";
import { TestEnemy1 } from "../../enemies/test_enemy1.js";
import { TestEnemy2 } from "../../enemies/test_enemy2.js";

export class TestRoom3 extends CombatRoom {
    constructor() {
        super()

        this.enemies = [
            new TestEnemy1,
            new TestEnemy2({x: 1230, y:290}),
            new TestEnemy2({x: 1400, y:290}),
            new TestEnemy2({x: 1570, y:290}),
            new TestEnemy2({x: 1740, y:290}),
            new TestEnemy2({x: 1910, y:290}),
        ]

        this.register()
    }
}