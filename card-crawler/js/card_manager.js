import { StrikeCard } from "./classes/cards/attacks/strike.js"
import { TerrorCard } from "./classes/cards/powers/terror.js"
import { DefendCard } from "./classes/cards/skills/defend.js"

export var full_card_list = []

export function cardManagerInit(){
    full_card_list.push(StrikeCard)
    

    full_card_list.push(DefendCard)


    full_card_list.push(TerrorCard)
}