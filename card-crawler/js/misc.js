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
    ctx.canvas.addEventListener('mousemove', (event) => {
        const rect = ctx.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        global.player.hand.forEach(card => {
            if (card.isMouseOver(mouseX, mouseY)) {
                card.hovering = true
                // Trigger any action you want when the card is hovered
            } else {
                card.hovering = false
            }
        });
    });
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