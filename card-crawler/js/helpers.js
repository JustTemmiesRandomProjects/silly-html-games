import { global } from "./global.js"

class CardHelper {
    constructor() {

    }

    damageEnemy(damage, enemy) {
        console.log(`dealing ${damage} damage to ${enemy.name}`)
        enemy.HP -= damage
        enemy.HP = Math.round(enemy.HP)
    }

    damageAllEnemies(damage) {
        global.current_room.enemies.forEach((enemy) => {
            this.damageEnemy(damage, enemy)
        })
    }

    healPlayer(health) {
        console.log(`healing the player ${health} HP`)
        global.player.HP += health
        if (global.player.HP > global.player.MAX_HP) {
            global.player.HP = global.player.MAX_HP
        }
    }
}

class EnemyHelper {
    constructor() {

    }

    damagePlayer(damage) {
        console.log(`dealing ${damage} damage to the player`)
        global.player.HP -= damage
        global.player.HP = Math.round(global.player.HP)
    }
}

class MetaHelper {
    constructor() {
        this.enemy_helper = new EnemyHelper
        this.card_helper = new CardHelper
    }
}

export const helpers = new MetaHelper