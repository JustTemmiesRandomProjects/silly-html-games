import { global, hudCtx } from "./global.js"

export function drawHud () {
    hudCtx.clearRect(0, 0, hudCtx.canvas.width, hudCtx.canvas.height)

    drawScore()
    drawCoins()
}

// draw features
function drawScore() {
    hudCtx.font = "48px Arial"
    hudCtx.fillStyle = "#FFA500AF"
    hudCtx.fillText(`Score: ${handleNumber(global.score)}` , 10, 54) 
}

function drawCoins() {
    hudCtx.font = "30px Arial"
    hudCtx.fillStyle = "#C874B2AF"
    hudCtx.fillText(`Coins: ${handleNumber(global.save_data["coins"])}` , 10, 96) 
}



// helper functions
function handleNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}