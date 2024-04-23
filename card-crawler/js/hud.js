import { debugHudCtx, global, hudCtx } from "./global.js"
import { randInt } from "./tems_library/tems_library.js"

export function drawHud () {
    hudCtx.clearRect(0, 0, hudCtx.canvas.width, hudCtx.canvas.height)

    if (global.player != null && global.player.render_hud) {
        drawDrawPile()
        drawDiscardPile()
    }
}

// draw features
function drawDrawPile() {
    hudCtx.font = "36px kalam-light"
    hudCtx.fillStyle = "#2d8dff"
    hudCtx.fillText(`Draw Pile: ${global.player.deck_pile.length}` , 40, 870) 
}

function drawDiscardPile() {
    hudCtx.font = "36px kalam-light"
    hudCtx.fillStyle = "#a038c8"
    hudCtx.fillText(`Restock Pile: ${global.player.discard_pile.length}` , 40, 920) 
}

export function drawDebug() {
    debugHudCtx.clearRect(0, 0, debugHudCtx.canvas.width, debugHudCtx.canvas.height)

    let sum = 0
    global.frame_times.forEach( num => {
        sum += num;
    })

    global.average_delta_time = sum / global.frame_times.length

    debugHudCtx.font = "24px kalam-light"
    debugHudCtx.fillStyle = "#a8a0a8"
    debugHudCtx.fillText(`Average Frame Times: ${(global.average_delta_time).toFixed(2)}` , 30, 40) 
    debugHudCtx.fillText(`Last delta_time: ${(global.delta_time).toFixed(2)}` , 30, 65) 
    debugHudCtx.fillText(`FPS: ${(1000 / (sum / global.frame_times.length)).toFixed(1)}` , 30, 90) 
}

// helper functions
export function handleNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}