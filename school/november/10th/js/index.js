import { randFloat, randInt } from "./tems_library.js";
import { global, canvas, ctx } from "./global.js";
import { Circle } from "./classes.js";


ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;


function ready() {
    for (let i = 0; i < global.circleCount; i++) {
        const radius = randInt(global.circleRadiusOffset, global.circleRadiusRand)
        global.circles.push(
            new Circle(
                randInt(radius, canvas.width - 2 * radius),
                randInt(radius, canvas.height - 2 * radius),
                radius,
                0,
                Math.PI * 2,
                randFloat(global.circleSpeedOffset, global.circleSpeedRand)
            )
        )
    }
}

function process() {
    requestAnimationFrame(process)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCircles()

    global.circles.forEach((circle) => {
        circle.move()
        // circle.applyVelocity(Math.PI * 1, 0.04)
    }
    )
}


function drawCircles() {
    canvas.clear
    for (let i = 0; i < global.circles.length; i++) {
        global.circles[i].draw()
    }
}


ready()
process()