console.log("index.js initialized")
import { randFloat, randInt, resizeCanvas, canvas_centre, drawBackgroundImage } from "./tems_library/tems_library.js"
import { loadMenu, showGameOverScreen } from "./main_menu/index.js"
import { Player } from "./classes/player.js"
import { global, ctx, backgroundCtx, particleCtx, hudCtx, initGlobal } from "./global.js"
import { drawHud } from "./hud.js"

const canvases = [
    ctx.canvas,
    backgroundCtx.canvas,
    hudCtx.canvas
]

// ready function, called when the program is ready, before the first game tick
function ready() {
    resizeCanvas(canvases, [updateBackground, drawHud])

    // console.log("playing audio...")
    // global.assets["music_fight"].play()
    // global.assets["music_fight"].loop(true)

    console.log("registering game ticks...")
    // make the gameTick10 function run every 100 ms
    setInterval(gameTick10, 100)

    // make the gameTick2 function run every 500 ms
    setInterval(gameTick2, 500)

    global.entities["players"].push( new Player() )
}

// process function, called every frame
async function process() {
    if ( !global.is_playing ) {
        return
    }

    global.frames_processed ++
    requestAnimationFrame(process)

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)


    for (const [key, value] of Object.entries(global.entities)) {
        for (const entity of value) {
            entity.tick()
        }
    }
}

// gameTick function, called 100 ms (10 times/second)
function gameTick10() {
    resizeCanvas(canvases, [updateBackground, drawHud])
}

// gameTick function, called every 500 ms (2 times/second)
function gameTick2() {

}

function updateBackground() {
    drawBackgroundImage(backgroundCtx, global.assets["sprite_background"])
}


// check if the global variable is ready every 100ms, until it's ready
// this might take some time as loading assets takes a bit of time
let initInterval = setInterval(async () => {
    if ( global !== null ) {
        clearInterval(initInterval)

        await loadMenu()

        console.log("setup fully complete!")
    }
}, 100)

export async function stop_game() {
    console.log("stopping game...")
    global.is_playing = false

    ctx.canvas.hidden = true
    particleCtx.canvas.hidden = true
    hudCtx.canvas.hidden = true

    console.log("unregistering game ticks...")
    clearInterval(gameTick10)
    clearInterval(gameTick2)

    console.log("resetting global variables...")
    requestAnimationFrame(initGlobal)

    console.log("displaying game over screen...")
    showGameOverScreen(global.score)

    console.log("set..down? complete!")
}

export function play_game() {
    global.is_playing = true

    ctx.canvas.hidden = false
    particleCtx.canvas.hidden = false
    hudCtx.canvas.hidden = false

    console.log("running ready() function...")
    ready()
    console.log("running first tick...")
    process()
}