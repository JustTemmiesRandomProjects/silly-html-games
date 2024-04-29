import { StrikeCard } from "../content/cards/attacks/strike.js"
import { ThunderclapCard } from "../content/cards/attacks/thunderclap.js"
import { AngerCard } from "../content/cards/attacks/anger.js"
import { PommelStrikeCard } from "../content/cards/attacks/pommel_strike.js"
import { DoomerangCard } from "../content/cards/attacks/doomerang.js"
import { HemokinisisCard } from "../content/cards/attacks/hemokinisis.js"
import { BatterCard } from "../content/cards/attacks/batter.js"
import { RampageCard } from "../content/cards/attacks/rampage.js"
import { ReaperCard } from "../content/cards/attacks/reaper.js"

import { TerrorCard } from "../content/cards/powers/terror.js"
import { DemonFormCard } from "../content/cards/powers/demon_form.js"

import { DefendCard } from "../content/cards/skills/defend.js"
import { LegSweepCard } from "../content/cards/skills/leg_sweep.js"
import { BloodlettingCard } from "../content/cards/skills/bloodletting.js"
import { BattlecryCard } from "../content/cards/skills/battlecry.js"

export var full_card_list = []

export function cardManagerInit(){
    full_card_list.push(StrikeCard)
    full_card_list.push(ThunderclapCard)
    full_card_list.push(AngerCard)
    full_card_list.push(PommelStrikeCard)
    full_card_list.push(DoomerangCard)
    full_card_list.push(BatterCard)
    full_card_list.push(HemokinisisCard)
    full_card_list.push(RampageCard)
    full_card_list.push(ReaperCard)
    
    // full_card_list.push(TerrorCard)
    // full_card_list.push(DemonFormCard)
    full_card_list.push(BloodlettingCard)
    full_card_list.push(BattlecryCard)

    // full_card_list.push(DefendCard)
    // full_card_list.push(LegSweepCard)
}