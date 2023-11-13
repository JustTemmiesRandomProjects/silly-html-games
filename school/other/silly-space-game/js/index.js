console.log("index.js initialized")

import { randFloat, randInt, resizeCanvas, canvas_centre } from "./tems_library/tems_library.js";
import { global, ctx, backgroundCtx } from "./global.js";
import { Circle, Player, meteor_sizes } from "./classes.js";
import { circleOverlapping, pointDistanceFromPoint } from "./tems_library/math.js";


// ready function, called when the program is ready, before the first game tick
function ready() {
    resizeCanvas(ctx.canvas, [backgroundCtx, global.assets["sprite_background"]])

    global.assets["music_fight"].play()
    global.assets["music_fight"].loop(true)

    // make the gameTick10 function run every 100 ms
    setInterval(gameTick10, 100)

    // make the gameTick2 function run every 500 ms
    setInterval(gameTick2, 500)

    global.players.push( new Player() )

    // create circles
    for (let i = 0; i < global.circle_count / 2; i++) {
        // loop over the available meteor sizes each time, for a varied size selection
        global.circles.push(
            new Circle( meteor_sizes[i % meteor_sizes.length] )
        )
        // add a second meteor that's either big or medium
        // this and the above push ensures that 1/8th of the meteors will be small or tiny,
        // whilst 3/8th of the meteors will be large or medium
        // this is done because tons of small meteors is "meh" gameplay wise
        global.circles.push(
            new Circle( meteor_sizes[i % Math.floor(meteor_sizes.length / 2)] )
        )
    }
    
    // distribute the circles accross the map, making sure they don't overlap each other, and that they don't spawn close to the player
    distributeCircles()

    // sort the circles based on size for them to render in the correct order
    sortCircleArray()
}

// process function, called every frame
async function process() {
    requestAnimationFrame(process)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    drawPlayers()
    drawCircles()

    // global.players.forEach((player) => {
    //     player.move()
    // })


    
    global.circles.forEach((circle) => {
        circle.move()
    })

}

// gameTick function, called 100 ms (10 times/second)
function gameTick10() {
    resizeCanvas(ctx.canvas, [backgroundCtx, global.assets["sprite_background"]])
}

// gameTick function, called every 500 ms (2 times/second)
function gameTick2() {
}

// draw all of the circles in the global.circles array
function drawCircles() {
    global.circles.forEach((circle) => {
        circle.draw()
    })

}

function drawPlayers() {
    global.players.forEach((player) => {
        player.draw()
    })
}

// sort the global.circles array based on the `radius` property of the circles, meaning that the bigger circles get drawn last
function sortCircleArray() {
    global.circles.sort((a, b) => a.radius - b.radius);
}

function distributeCircles() {
    // make sure none of the meteors are overlapping
    for (let j = 0; j < global.circles.length; j++ ) {
        let fall_back_counter = 0
        for (let i = 0; i < global.circles.length; i++) {
            if ( i != j ) {
                if ( 
                    pointDistanceFromPoint([global.circles[i].position.x, global.circles[i].position.y], canvas_centre) < global.player_spawn_safe_radius
                    || circleOverlapping(global.circles[i], global.circles[j])
                ) {
                    console.log(`re-randomizing position of meteor at index ${j}`)
                    global.circles[i].position = {
                        "x": randInt(global.circles[i].radius, ctx.canvas.width - 2 * global.circles[i].radius),
                        "y": randInt(global.circles[i].radius, ctx.canvas.height - 2 * global.circles[i].radius)
                    }
                    
                    fall_back_counter ++
                    if ( fall_back_counter == 50 ){
                        console.log(`failed to set position of meteor on index ${j}, oh well ig`)
                        break
                    }

                    i = -1
                }
            }
        }
    }
}


// check if the global variable is ready every 100ms, until it's ready
// this might take some time as loading assets takes a bit of time
let initInterval = setInterval(() => {
    if (global !== null) {
        ctx.canvas.hidden = false
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