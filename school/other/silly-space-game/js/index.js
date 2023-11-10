import { randFloat, randInt } from "./tems_library.js";
import { global, canvas, ctx } from "./global.js";
import { Circle } from "./classes.js";

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;


// ready function, called when the program is ready, before the first game tick
function ready() {
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

// process function, called every tick
function process() {
    requestAnimationFrame(process)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCircles()

    global.circles.forEach((circle) => {
        circle.move()
        circle.applyVelocity(Math.PI * 1.5, circle.dx/10)
    }
    )
}

// draw all of the circles in the global.circles array
function drawCircles() {
    canvas.clear
    for (let i = 0; i < global.circles.length; i++) {
        global.circles[i].draw()
    }
}

// sort the global.circles array based on the `radius` property of the circles, meaning that the bigger circles get drawn last
function sortCircleArray() {
    global.circles.sort((a, b) => a.radius - b.radius);
}


ready()
process()