import { TestEnemy1 } from "../content/enemies/test_enemy1.js"
import { TestEnemy2 } from "../content/enemies/test_enemy2.js"

export var full_enemy_list = []

export function enemyManagerInit(){
    full_enemy_list.push(TestEnemy1)
    full_enemy_list.push(TestEnemy2)
}