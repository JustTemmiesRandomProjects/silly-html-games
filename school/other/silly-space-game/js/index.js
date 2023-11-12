console.log("index.js initialized")

import { randFloat, randInt, resizeCanvas, drawBackgroundImage } from "./tems_library/tems_library.js";
import { global, canvas, ctx } from "./global.js";
import { Circle, meteor_sizes } from "./classes.js";

resizeCanvas(canvas)

// ready function, called when the program is ready, before the first game tick
function ready() {
    global.assets["music_fight"].play()
    global.assets["music_fight"].loop(true)

    // make the gameTick10 function run every 100 ms
    setInterval(gameTick10, 100)

    // make the gameTick2 function run every 500 ms
    setInterval(gameTick2, 500)


    // create circles
    for (let i = 0; i < global.circle_count; i++) {
        // loop over the available meteor sizes each time, for a varied size selection
        global.circles.push(
            new Circle( meteor_sizes[i % meteor_sizes.length] )
        )
    }

    // sort the circles based on size
    sortCircleArray()

}

// process function, called every frame
async function process() {
    requestAnimationFrame(process)
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBackgroundImage(ctx, canvas, global.assets["sprite_background"])
    drawCircles()
    
    global.circles.forEach((circle) => {
        circle.move()
    })

}

// gameTick function, called 100 ms (10 times/second)
function gameTick10() {
}

// gameTick function, called every 500 ms (2 times/second)
function gameTick2() {
    resizeCanvas(canvas)
}

// draw all of the circles in the global.circles array
function drawCircles() {
    canvas.clear
    for (let i = 0; i < global.circles.length; i++) {
        global.circles[i].draw()
        // global.circles[i].applyVelocity(Math.PI * 1, 0.1)
    }
}

// sort the global.circles array based on the `radius` property of the circles, meaning that the bigger circles get drawn last
function sortCircleArray() {
    global.circles.sort((a, b) => a.radius - b.radius);
}


// check if the global variable is ready every 100ms, until it's ready
// this might take some time as loading assets takes a bit of time
let initInterval = setInterval(() => {
    if (global !== null) {
        canvas.hidden = false
        clearInterval(initInterval)
        console.log("running ready() function...")
        ready()
        console.log("running first tick...")
        process()

        // delete the loading bar
        document.getElementById("loading-bar").remove()
        console.log("setup fully complete!")
    }
}, 100);