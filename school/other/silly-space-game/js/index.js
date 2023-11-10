import { randFloat, randInt, resizeCanvas } from "./tems_library.js";
import { global, canvas, ctx } from "./global.js";
import { Circle } from "./classes.js";

resizeCanvas(canvas)

// image to display that the game is loading
var loading = document.createElement("img")
loading.src = "../assets/sprites/loading/loading.gif"
loading.id = "loading-bar"
document.body.appendChild(loading)

// ready function, called when the program is ready, before the first game tick
function ready() {
    // make the gameTick1 function run every 1000 ms
    setInterval(gameTick1, 1000)

    // create circles
    for (let i = 0; i < global.circle_count; i++) {
        const radius = randFloat(global.circle_radius_offset, global.circle_radius_rand)
        global.circles.push(
            new Circle(
                randInt(radius, canvas.width - 2 * radius),
                randInt(radius, canvas.height - 2 * radius),
                radius,
                0,
                Math.PI * 2,
                randFloat(global.circle_speed_offset, global.circle_speed_rand)
            )
        )
    }

    // sort the circles based on size
    sortCircleArray()
}

// process function, called every frame
function process() {
    requestAnimationFrame(process)
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBackground()
    drawCircles()

    global.circles.forEach((circle) => {
        circle.move()
    })
}

// gameTick function, called every tick (10 times/second)
function gameTick10 () {
}


// gameTick function, called every 10 gameticks (1 time/second)
function gameTick1 () {
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

function drawBackground() {
    ctx.drawImage(global.images["background"], 0, 0)
}

// sort the global.circles array based on the `radius` property of the circles, meaning that the bigger circles get drawn last
function sortCircleArray() {
    global.circles.sort((a, b) => a.radius - b.radius);
}

// check if the global variable is ready every 100ms, until it's ready
let initInterval = setInterval(() => {
    if (global !== null) {
        canvas.hidden = false
        clearInterval(initInterval)
        console.log("running ready() function...")
        ready()
        console.log("running first tick...")
        process()

        // delete the loading bar
        loading.remove()
    }
}, 100);