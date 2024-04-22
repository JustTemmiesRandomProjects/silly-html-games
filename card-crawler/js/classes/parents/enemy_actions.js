import { helpers } from "../../helpers.js"

export class EnemyAction {
    constructor(intent, intent_function) {
        this.intent = intent

        if (intent_function != undefined) {
            this.intent_function = intent_function
        
        } else if (intent[0] == "damage") {
            this.intent_function = function() {
                helpers.enemy_helper.damagePlayer(intent[1])
            }
        
        } else if (intent[0] == "defend") {
            this.intent_function = function() {
                helpers.enemy_helper.damagePlayer(intent[1])
            }
        
        }
    }
}