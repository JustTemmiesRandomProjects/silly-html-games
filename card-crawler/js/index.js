console.log("index.js initialized")
import { randFloat, randInt, resizeCanvas, canvas_centre } from "./tems_library/tems_library.js"
import { loadMenu, playButtonClick, showGameOverScreen } from "./main_menu/index.js"

import { Background } from "./classes/entities/background.js"
import { Card } from "./classes/parents/card.js"
import { Player } from "./classes/entities/player.js"

import { drawHud } from "./hud.js"
import { global, ctx, backgroundCtx, particleCtx, hudCtx, initGlobal, focusingCardCtx, debugHudCtx, WebGLHudCtx, WebGLTopCtx } from "./global.js"
import { miscSetup, gameTick10, gameTick2, updateBackground, contexts } from "./misc.js"
import { CombatRoom } from "./classes/rooms/combat.js"
import { MiscRoom } from "./classes/rooms/misc.js"
import { cardManagerInit, full_card_list } from "./card_manager.js"
import { Shader } from "./tems_library/shaders.js"

import shader_data from "./shaders/testing/test.js"

// ready function, called when the program is ready, before the first game tick
function ready() {
    cardManagerInit()

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

    // const positions = [
    //     -0.7, -0.9,
    //     0.9, -0.7,
    //     -0.9, 0.7,
    //     0.7, 0.9,
    // ];
    // const test_shader = new Shader(WebGLTopCtx, positions, shader_data)
    // global.entities["shaders"].push(test_shader)

    global.player = new Player
    global.entities["actors"].push(global.player)
    
    global.current_room = new MiscRoom
    
    for (let i = 0; i < 100; i++) {
        let card = full_card_list[randInt(0, full_card_list.length)]
        let card_instace = new card()
        card_instace.processing = false
        global.player.deck.push(card_instace)
    }

    global.entities["backgrounds"].push( new Background() )

    miscSetup()
}

// process function, called every frame
async function process() {
    if ( !global.is_playing ) {
        return
    } else if ( !global.is_focused ) {
        requestAnimationFrame(process)
        return
    }

    global.delta_time = window.performance.now() - global.last_frame_timestamp
    global.last_frame_timestamp = window.performance.now()

    global.frame_times.push(global.delta_time)

    if (global.frame_times.length > 90) {
        global.frame_times.splice(0, 1)
    }

    global.frames_processed ++
    requestAnimationFrame(process)

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // run the tick function on every entity
    for (const [key, value] of Object.entries(global.entities)) {
        for (const entity of value) {
            entity.tick()
        }
    }

    // used for deferred ticks
    global.deferred_calls.forEach((e) => {
        // dispatchEvent seemed to crash this, idk, this might be a lil buggy
        if (e.namespace[e.func] != dispatchEvent) {
            e.namespace[e.func](...e.optional_arguments)
        } else {
            console.log("e.namespace[e.func] is of type dispatchEvent, ignoring call")
        }
    })

    global.deferred_calls = []

    drawHud()

    // finally, run the combat-room tick
    global.current_room.tick()
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