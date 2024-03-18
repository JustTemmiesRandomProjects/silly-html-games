import { randFloat, randInt, resizeCanvas, canvas_centre, drawBackgroundImage } from "./tems_library/tems_library.js"
import { loadMenu, showGameOverScreen } from "./main_menu/index.js"

import { Background } from "./classes/background.js"
import { UnoCard } from "./classes/unocard.js"

import { global, ctx, backgroundCtx, particleCtx, hudCtx, initGlobal } from "./global.js"
import { drawHud } from "./hud.js"


export function miscSetup() {
    ctx.canvas.addEventListener('mousemove', (event) => {
        const rect = ctx.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        console.log("hi")

        global.hand.forEach(card => {
            if (card.isMouseOver(mouseX, mouseY)) {
                console.log(`mouse over card ${card.ID}`);
                card.glowing = true
                // Trigger any action you want when the card is hovered
            } else {
                card.glowing = false
            }
        });
    });
}