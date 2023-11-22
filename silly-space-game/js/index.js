console.log("index.js initialized")

import { randFloat, randInt, resizeCanvas, canvas_centre } from "./tems_library/tems_library.js";
import { checkLaserCircleCollision, circleOverlapping, pointDistanceFromPoint } from "./tems_library/math.js";
import { settings } from "./tems_library/settings.js";
import { load_menu } from "./main_menu/index.js";
import { LaserParticle, Particle } from "./classes/particles.js";
import { Circle, meteor_sizes, meteor_sprites } from "./classes/circles.js";
import { Player } from "./classes/player.js";
import { global, ctx, backgroundCtx, inputManager, particleCtx } from "./global.js";



// ready function, called when the program is ready, before the first game tick
function ready() {
    resizeCanvas([ctx.canvas, particleCtx.canvas, backgroundCtx.canvas], [backgroundCtx, global.assets["sprite_background"]])

    console.log("playing audio...")
    global.assets["music_fight"].play()
    global.assets["music_fight"].loop(true)

    console.log("registering game ticks...")
    // make the gameTick10 function run every 100 ms
    setInterval(gameTick10, 100)

    // make the gameTick2 function run every 500 ms
    setInterval(gameTick2, 500)

    console.log("spawning player...")
    global.players.push( new Player() )

    console.log("spawning meteors...")
    // create circles
    for (let i = 0; i < global.circle_count / 2; i++) {
        // loop over the available meteor sizes each time, for a varied size selection
        global.circles.push(
            new Circle( i % meteor_sizes.length )
        )
        // add a second meteor that's either big or medium
        // this and the above push ensures that 1/8th of the meteors will be small or tiny,
        // whilst 3/8th of the meteors will be large or medium
        // this is done because tons of small meteors is "meh" gameplay wise
        global.circles.push(
            new Circle( i % Math.floor(meteor_sizes.length / 2) )
        )
    }
    
    // for (let i = 0; i < 10; i++) {
    //     global.particles.push(
    //         new LaserParticle(
    //             randInt(100, 600), randInt(100, 600),
    //             randFloat(25, 30), "#ee88f8", particleCtx
    //         )
    //     )
    // }
    
    console.log("distributing meteors...")
    // distribute the circles accross the map, making sure they don't overlap each other, and that they don't spawn close to the player
    distributeCircles()

    console.log("sorting the meteors based on size...")
    // sort the circles based on size for them to render in the correct order
    sortCircleArray()
}

// process function, called every frame
async function process() {
    requestAnimationFrame(process)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    particleCtx.clearRect(0, 0, particleCtx.canvas.width, particleCtx.canvas.height)

    drawCircles()
    processLasers()
    drawPlayers()
    drawParticles()
    

    global.players.forEach((player) => {
        player.tick()
    })
    
    global.circles.forEach((circle) => {
        circle.tick()
    })
    
    removeCompletedParticles()
}

// gameTick function, called 100 ms (10 times/second)
function gameTick10() {
    resizeCanvas([ctx.canvas, particleCtx.canvas, backgroundCtx.canvas], [backgroundCtx, global.assets["sprite_background"]])
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

function processLasers() {
    // check if any lasers and circles are overlapping
    global.lasers.forEach((laser) => {
        global.circles.forEach((circle) => {
            if ( checkLaserCircleCollision(laser, circle) && circle.immunity_frames == 0 ) {
                global.particles.push (new LaserParticle(
                    circle.position["x"], circle.position["y"],
                    circle.radius * 1.3, circle.colour, particleCtx
                ))
                global.circles = global.circles.filter(temp_circle => temp_circle.ID != circle.ID)
                if ( circle.size_index + 1 < meteor_sizes.length ) {
                    const meteor_count = 3
                    const random_angle = randFloat(0, Math.PI * 2);
                    const meteor_ids_for_size_class = meteor_sprites[
                        meteor_sizes[
                            circle.size_index + 1
                        ]
                    ]
                    const new_size = global.asset_bonus_data[meteor_ids_for_size_class[randInt(0, meteor_ids_for_size_class.length)]]["hitboxRadius"]
                    const new_speed = (
/* the x velocity of the old circle                 */    (circle.velocity["x"]
/* devide by math.cos() in order to get it's speed  */    / Math.cos(circle.random_angle))
/* the "weight" of the old circle                   */    * circle.radius
/* the "weight" of the new circle(s)                */    / new_size
/* the amount of new circles                        */    / meteor_count
/* offset the speed based on the laser's power      */    + Math.min(4, global.players_last_shot_laser_power / 2000)
/* just a constant                                  */    + 1
                    )
                    
                    for (let i = 0; i < meteor_count; i++) {
                        const new_pos = {"x": 0, "y":0}
                        new_pos["x"] = circle.position["x"] + 7 * i
                        new_pos["y"] = circle.position["y"] + 7 * i
                        
                        global.circles.push(
                            new Circle(
                                circle.size_index + 1, new_pos,
                                random_angle + (Math.PI / meteor_count) * i * 2, new_speed
                            )
                        )
                        console.log(random_angle + (Math.PI / meteor_count) * i * 2)
                    }
                }
            }
        })
    })

    global.lasers.forEach((laser) => {
        laser.tick()
    })
    global.lasers = global.lasers.filter(laser => laser.width > 1)
}

function drawParticles() {
    global.particles.forEach((particle) => {
        particle.tick()
    })
}

function removeCompletedParticles() {
    global.particles = global.particles.filter(particle => particle.isComplete == false)
}

// sort the global.circles array based on the `radius` property of the circles, meaning that the bigger circles get drawn last
function sortCircleArray() {
    global.circles.sort((a, b) => a.radius - b.radius);
}

// make sure the circles have good-ish spawn locations
function distributeCircles() {
    for (let j = 0; j < global.circles.length; j++ ) {
        let fall_back_counter = 0
        for (let i = 0; i < global.circles.length; i++) {
            if ( i != j ) {
                if ( 
                    // make sure none of the meteors are too close to the player
                    pointDistanceFromPoint([global.circles[i].position.x, global.circles[i].position.y], canvas_centre) < global.player_spawn_safe_radius
                    // make sure none of the meteors are overlapping
                    || circleOverlapping(global.circles[i], global.circles[j])
                ) {
                    console.log(`re-randomizing position of meteor at index ${i}`)
                    global.circles[i].position = {
                        "x": randInt(global.circles[i].radius, ctx.canvas.width - 2 * global.circles[i].radius),
                        "y": randInt(global.circles[i].radius, ctx.canvas.height - 2 * global.circles[i].radius)
                    }
                    
                    fall_back_counter ++
                    if ( fall_back_counter == 50 ){
                        console.log(`failed to set position of meteor on index ${i}, oh well ig`)
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
let initInterval = setInterval(async () => {
    if ( global !== null ) {
        clearInterval(initInterval)
        
        await load_menu()

        console.log("setup fully complete!")
    }
}, 100);

export function play_game() {
    const menu = document.getElementById("main-menu")
    menu.hidden = true

    // re-check settings and stuff
    if ( settings.visible_audio_players ) {
        for (const [key] of Object.entries(global.assets)) {
            
            // if the asset has a function updateVisibilty, call it
            const asset = global.assets[key]
            if ( typeof asset.updateVisibilty == "function" ) {
                asset.updateVisibilty();
            }
        }
    }

    ctx.canvas.hidden = false
    particleCtx.canvas.hidden = false

    console.log("running ready() function...")
    ready()
    console.log("running first tick...")
    process()
}