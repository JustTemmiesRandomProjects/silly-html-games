import { global, ctx, backgroundCtx, particleCtx, hudCtx, initGlobal, focusingCardCtx, debugHudCtx, WebGLTopCtx, WebGLHudCtx } from "./global.js"
import { randFloat, randInt, resizeCanvas, canvas_centre } from "./tems_library/tems_library.js"
import { loadMenu, showGameOverScreen } from "./main_menu/index.js"

import { Background } from "./classes/entities/background.js"

import { drawDebug, drawHud } from "./hud.js"
import { drawBackgroundImage } from "./tems_library/rendering.js"

export const contexts = [
    ctx,
    backgroundCtx,
    hudCtx,
    debugHudCtx,
    WebGLHudCtx,
    focusingCardCtx,
    WebGLTopCtx,
]

export function miscSetup() {
    
}

// gameTick function, called 100 ms (10 times/second)
export function gameTick10() {
    resizeCanvas(contexts, [updateBackground, drawHud])
}

// gameTick function, called every 500 ms (2 times/second)
export function gameTick2() {
    drawDebug()
}

export function updateBackground() {
    drawBackgroundImage(backgroundCtx, global.assets["sprite_background"])
}

export function splitTextToFit(text, maxWidth) {
    let words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = ctx.measureText(currentLine + ' ' + word).width;

        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'hidden') {
        global.is_focused = false
    } else {
        global.is_focused = true
    }

    console.log(`window visibility changed to ${document.visibilityState}, is_focused is now set to ${global.is_focused}`)
});

document.addEventListener('contextmenu', event => {
    event.preventDefault();
});