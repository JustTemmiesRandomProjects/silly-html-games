import { global, hudCtx } from "./global.js"

export function drawHud () {
    hudCtx.clearRect(0, 0, hudCtx.canvas.width, hudCtx.canvas.height)

    drawScore()
}

// draw features
function drawScore() {
    hudCtx.font = "48px Arial"
    hudCtx.fillStyle = "#FFA500AF"
    hudCtx.fillText(`Score: ${handleNumber(global.score)}` , 10, 54) 
}


// helper functions
export function handleNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}