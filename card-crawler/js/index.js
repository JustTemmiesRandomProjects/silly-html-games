console.log("index.js initialized")
import { global, ctx, backgroundCtx, particleCtx, hudCtx, initGlobal, focusingCardCtx, debugHudCtx, WebGLHudCtx, WebGLTopCtx } from "./global.js"

import { randFloat, randInt, resizeCanvas, canvas_centre } from "./tems_library/tems_library.js"
import { loadMenu, playButtonClick, showGameOverScreen } from "./main_menu/index.js"

import { Background } from "./classes/entities/background.js"
import { Card } from "./classes/parents/card.js"
import { Player } from "./classes/entities/player.js"

import { drawHud } from "./hud.js"
import { miscSetup, gameTick10, gameTick2, updateBackground, contexts } from "./misc.js"
import { MiscRoom } from "./classes/rooms/misc.js"

import { cardManagerInit, full_card_list } from "./managers/card_manager.js"
import { combatRoomManagerInit } from "./managers/combat_room_manager.js"
import { enemyManagerInit } from "./managers/enemy_manager.js"
import { setRoomType } from "./managers/room_manager.js"
import { StrikeCard } from "./content/cards/attacks/strike.js"
import { ThunderclapCard } from "./content/cards/attacks/thunderclap.js"


// ready function, called when the program is ready, before the first game tick
function ready() {
    cardManagerInit()
    combatRoomManagerInit()
    enemyManagerInit()

    resizeCanvas(contexts, [updateBackground, drawHud])
    ctx.imageSmoothingEnabled = true

    // console.log("playing audio...")
    // global.assets["music_fight"].play()
    // global.assets["music_fight"].loop(true)

    console.log("registering game ticks...")
    // make the gameTick10 function run every 100 ms
    setInterval(gameTick10, 100)

    // make the gameTick2 function run every 500 ms
    setInterval(gameTick2, 500)

    global.player = new Player
    global.entities["actors"].push(global.player)
    
    setRoomType("combat")
    
    for (let i = 0; i < 1; i++) {
        // let card = full_card_list[randInt(0, full_card_list.length)]
        let card_instace = new StrikeCard
        card_instace.processing = false
        global.player.deck.push(card_instace)
        let card_instace2 = new ThunderclapCard
        card_instace.processing = false
        global.player.deck.push(card_instace2)
    }

    global.entities["backgrounds"].push( new Background() )

    miscSetup()
}

// process function, called every frame
async function process() {
    if (!global.is_playing) {
        return
    }

    global.delta_time = window.performance.now() - global.last_frame_timestamp
    global.last_frame_timestamp = window.performance.now()

    if (!global.is_focused) {
        requestAnimationFrame(process)
        return
    }

    global.loaded_entities = 0

    global.frame_times.push(global.delta_time)

    if (global.frame_times.length > 90) {
        global.frame_times.splice(0, 1)
    }

    global.frames_processed ++
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    // run the tick function on every entity
    for (const [key, value] of Object.entries(global.entities)) {
        for (const entity of value) {
            entity.tick()
            entity.genericEntityTick()
        }
    }
    
    // used for deferred ticks
    global.deferred_calls.forEach((e) => {
        // dispatchEvent seemed to crash this, idk, this might be a lil buggy
        if (e.namespace[e.func] == dispatchEvent) {
            console.log("e.namespace[e.func] is of type dispatchEvent, ignoring call")
        } else {
            e.namespace[e.func](...e.optional_arguments)
        }
    })

    global.deferred_calls = []
    
    drawHud()
    
    // finally, run the combat-room tick
    if (global.current_room != null) {
        global.current_room.tick()
    } else {
        console.log(global.current_room)
    }

    requestAnimationFrame(process)
}

// check if the global variable is ready every 100ms, until it's ready
// this might take some time as loading assets takes a bit of time
let initInterval = setInterval(async () => {
    if ( global !== null ) {
        clearInterval(initInterval)

        await loadMenu()

        console.log("setup fully complete!")

        // whilst in development, this skips the main menu
        playButtonClick()
    }
}, 100)


export function play_game() {
    global.is_playing = true

    ctx.canvas.hidden = false
    particleCtx.canvas.hidden = false
    hudCtx.canvas.hidden = false
    debugHudCtx.canvas.hidden = false
    WebGLHudCtx.canvas.hidden = false
    focusingCardCtx.canvas.hidden = false
    WebGLTopCtx.canvas.hidden = false

    console.log("running ready() function...")
    ready()
    console.log("running first tick...")
    process()
    
    console.log("game setup complete!")
}