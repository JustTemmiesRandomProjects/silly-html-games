import { CombatRoom } from "../../../classes/rooms/combat.js";
import { TestEnemy1 } from "../../enemies/test_enemy1.js";

export class TestRoom1 extends CombatRoom {
    constructor() {
        super()

        this.enemies = [
            new TestEnemy1
        ]

        this.register()
    }
}