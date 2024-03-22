import { randFloat, randInt, resizeCanvas, canvas_centre, drawBackgroundImage } from "./tems_library/tems_library.js"
import { loadMenu, showGameOverScreen } from "./main_menu/index.js"

import { Background } from "./classes/background.js"

import { global, ctx, backgroundCtx, particleCtx, hudCtx, initGlobal } from "./global.js"
import { drawHud } from "./hud.js"

export const canvases = [
    ctx.canvas,
    backgroundCtx.canvas,
    hudCtx.canvas
]

export function miscSetup() {
    
}

// gameTick function, called 100 ms (10 times/second)
export function gameTick10() {
    resizeCanvas(canvases, [updateBackground, drawHud])
}

// gameTick function, called every 500 ms (2 times/second)
export function gameTick2() {

}

export function updateBackground() {
    drawBackgroundImage(backgroundCtx, global.assets["sprite_background"])
}