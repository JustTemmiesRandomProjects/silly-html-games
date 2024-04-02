import { global, hudCtx } from "./global.js"
import { randInt } from "./tems_library/tems_library.js"

export function drawHud () {
    hudCtx.clearRect(0, 0, hudCtx.canvas.width, hudCtx.canvas.height)

    if (global.player != null) {
        drawDrawPile()
        drawDiscardPile()
    }
}

// draw features
function drawDrawPile() {
    hudCtx.font = "32px Arial"
    hudCtx.fillStyle = "#FFA500AF"
    hudCtx.fillText(`Draw Pile: ${global.player.deck_pile.length}` , 20, 880) 
}

function drawDiscardPile() {
    hudCtx.font = "32px Arial"
    hudCtx.fillStyle = "#FFA500AF"
    hudCtx.fillText(`Discard Pile: ${global.player.discard_pile.length}` , 20, 920) 
}


// helper functions
export function handleNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}