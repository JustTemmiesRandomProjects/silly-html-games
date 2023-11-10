import { randFloat, randInt, resizeCanvas } from "./tems_library.js";
import { global, canvas, ctx } from "./global.js";
import { Circle } from "./classes.js";

resizeCanvas(canvas)

// image to display that the game is loading
var loading = document.createElement("img")
loading.src = "../assets/sprites/loading/loading.gif"
loading.id = "loading-bar"
document.getElementById("misc").appendChild(loading)

// ready function, called when the program is ready, before the first game tick
function ready() {
    // global.assets["music_battle"].play()
    global.assets["music_battle"].loop(true)

    // make the gameTick2 function run every 500 ms
    setInterval(gameTick2, 500)

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


// gameTick function, called every 5 gameticks (2 times/second)
function gameTick2 () {
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

// draw the background, crop the image if needed to fill the screen
// the transformations took me too fucking long lmao
function drawBackground() {
    const image = global.assets["sprite_background"]
    
    const scale = Math.max(
        canvas.width/image.width,
        canvas.height/image.height
    )
    
    //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform
    ctx.setTransform(
      /*     scale x */ scale,
      /*      skew x */ 0,
      /*      skew y */ 0,
      /*     scale y */ scale,
      /* translate x */ (canvas.width - scale * image.width) / 2,
      /* translate y */ (canvas.height - scale * image.height) / 2,
    );
  
    ctx.drawImage(image, 0, 0)
    ctx.setTransform(1,0,0,1,0,0);
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