import { StrikeCard } from "../content/cards/attacks/strike.js"
import { ThunderclapCard } from "../content/cards/attacks/thunderclap.js"

import { TerrorCard } from "../content/cards/powers/terror.js"
import { DemonFormCard } from "../content/cards/powers/demon_form.js"

import { DefendCard } from "../content/cards/skills/defend.js"
import { LegSweepCard } from "../content/cards/skills/leg_sweep.js"

export var full_card_list = []

export function cardManagerInit(){
    full_card_list.push(StrikeCard)
    full_card_list.push(ThunderclapCard)
    
    // full_card_list.push(TerrorCard)
    // full_card_list.push(DemonFormCard)

    // full_card_list.push(DefendCard)
    // full_card_list.push(LegSweepCard)
}