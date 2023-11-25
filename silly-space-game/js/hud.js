import { global, hudCtx } from "./global.js";

export function drawHud () {
    hudCtx.clearRect(0, 0, hudCtx.canvas.width, hudCtx.canvas.height)
    drawScore()
}

// draw features
function drawScore() {
    hudCtx.font = "30px Arial";
    hudCtx.fillStyle = '#FFA500'; // Orange color
    hudCtx.fillText(`Score: ${handleNumber(global.score)}` , 10, 40); 
}



// helper functions
function handleNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}