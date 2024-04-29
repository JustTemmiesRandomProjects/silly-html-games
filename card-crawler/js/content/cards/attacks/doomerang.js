import { AttackCard } from "../../../classes/parents/card_types/attack.js"
import { global } from "../../../global.js"
import { helpers } from "../../../helpers.js"
import { randInt } from "../../../tems_library/tems_library.js"

export class DoomerangCard extends AttackCard {
    constructor() {
        super()

        this.name = "Doomerang"
        this.description = "Deal 3 damage to a random enemy 4 times."

        this.play = function() {
            for (let i = 0; i < 4; i ++) {
                const inital_enemy_index = randInt(0, global.current_room.enemies.length)
                let enemy_index = structuredClone(inital_enemy_index)
                let enemy = global.current_room.enemies[enemy_index]
                while (enemy.HP < 0) {
                    enemy_index++
                    if (enemy_index == inital_enemy_index) {
                        break
                    }

                    enemy = global.current_room.enemies[enemy_index]
                }

                helpers.card_helper.damageEnemy(
                    3,
                    enemy
                )
            }
        }

        this.register()
    }
}