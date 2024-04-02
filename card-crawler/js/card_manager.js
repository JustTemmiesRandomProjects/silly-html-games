import { StrikeCard } from "./classes/cards/attacks/strike.js"
import { ThunderclapCard } from "./classes/cards/attacks/thunderclap.js"

import { TerrorCard } from "./classes/cards/powers/terror.js"
import { DemonFormCard } from "./classes/cards/powers/demon_form.js"

import { DefendCard } from "./classes/cards/skills/defend.js"
import { LegSweepCard } from "./classes/cards/skills/leg_sweep.js"

export var full_card_list = []

export function cardManagerInit(){
    full_card_list.push(StrikeCard)
    full_card_list.push(ThunderclapCard)
    
    full_card_list.push(TerrorCard)
    full_card_list.push(DemonFormCard)

    full_card_list.push(DefendCard)
    full_card_list.push(LegSweepCard)
}