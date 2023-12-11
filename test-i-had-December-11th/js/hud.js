import { global, hudCtx } from "./global.js";

export function drawHud() {
    hudCtx.clearRect(0, 0, hudCtx.canvas.width, hudCtx.canvas.height);

    drawScore();
    drawStrength();
}

// draw features
function drawScore() {
    hudCtx.font = "48px Arial";
    hudCtx.fillStyle = "#FFA500AF";
    hudCtx.fillText(`Targets Hit: ${handleNumber(global.score)}`, 10, 54);
}

function drawStrength() {
    if (global.entities["players"][0] == undefined) {
        return;
    }

    const shooting_speed = Math.round(global.entities["players"][0].shooting_strength * 10) / 10;

    hudCtx.font = "24px Arial";
    hudCtx.fillStyle = "#FF00A5AF";
    hudCtx.fillText(`Shooting Strength: ${shooting_speed}`, 12, 94);
}

// helper functions
export function handleNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
