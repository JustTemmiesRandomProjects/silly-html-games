console.log("index.js initialized")
import { randFloat, randInt, resizeCanvas, canvas_centre, drawBackgroundImage } from "./tems_library/tems_library.js"
import { checkLaserCircleCollision, circleOverlapping, pointDistanceFromPoint } from "./tems_library/math.js"
import { settings } from "./tems_library/settings.js"
import { loadMenu, showGameOverScreen } from "./main_menu/index.js"
import { hasUpgrade } from "./main_menu/shop.js"
import { LaserParticle } from "./classes/particles.js"
import { Circle, meteor_sizes, meteor_sprites } from "./classes/circles.js"
import { Player } from "./classes/player.js"
import { Coin } from "./classes/coin.js"
import { global, ctx, backgroundCtx, particleCtx, hudCtx, initGlobal } from "./global.js"
import { drawHud } from "./hud.js"
import { getCookie, setCookie } from "./cookies.js"



// ready function, called when the program is ready, before the first game tick
function ready() {
    resizeCanvas([ctx.canvas, particleCtx.canvas, backgroundCtx.canvas, hudCtx.canvas], [updateBackground, drawHud])

    console.log("playing audio...")
    global.assets["music_fight"].play()
    global.assets["music_fight"].loop(true)

    console.log("registering game ticks...")
    // make the gameTick10 function run every 100 ms
    setInterval(gameTick10, 100)

    // make the gameTick2 function run every 500 ms
    setInterval(gameTick2, 500)

    console.log("spawning player...")
    if ( hasUpgrade("clone_start") ) {
        global.players.push( new Player({
            "x": ctx.canvas.width / 2 + 75,
            "y": ctx.canvas.height / 2
        }) )
        global.players.push( new Player({
            "x": ctx.canvas.width / 2 -75,
            "y": ctx.canvas.height / 2
        }) )
    } else {
        global.players.push( new Player() )
    }

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

    console.log("drawing hud...")
    drawHud()
    
    // spawn coins
    for (let i = 0; i < 2; i ++) {
        spawnNewCoin(global.players[0])
    }

    if ( hasUpgrade("more_coins_1") ) {
        spawnNewCoin(global.players[0])
    }
}

// process function, called every frame
async function process() {
    if ( !global.is_playing ) {
        return
    }

    global.frames_processed ++
    requestAnimationFrame(process)

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    particleCtx.clearRect(0, 0, particleCtx.canvas.width, particleCtx.canvas.height)

    
    drawCoins()
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

    // weird settings
    if ( settings.player_invincible ) {
        global.players.forEach((player) => {
            player.shield_health = 100
        })
    }
}

// gameTick function, called 100 ms (10 times/second)
function gameTick10() {
    resizeCanvas([ctx.canvas, particleCtx.canvas, backgroundCtx.canvas, hudCtx.canvas], [updateBackground, drawHud])
}

// gameTick function, called every 500 ms (2 times/second)
function gameTick2() {
    // if any circles are too far out of bounds, delete them to save performance, this might happen if they collide whilst out of bounds, just after spawning whilst running
    global.circles.forEach((circle) => {
        if ( Math.abs(circle.position["x"] - ctx.canvas.width / 2) > ctx.canvas.width * 2 ) {
            global.circles = global.circles.filter(temp_circle => temp_circle.ID != circle.ID)
        } else if ( Math.abs(circle.position["y"] - ctx.canvas.height / 2) > ctx.canvas.height * 2 ) (
            global.circles = global.circles.filter(temp_circle => temp_circle.ID != circle.ID)
        )
    })
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
                const score_awards = {
                    "big": 5000,
                    "medium": 2500,
                    "small": 1000,
                    "tiny": 250
                }
                
                global.score += score_awards[circle.size]
                // spawn a clone for every 25,000 score you get
                if ( hasUpgrade("clone_score") ) {
                    if ( (global.score - global.coins_picked_up_this_round * 20000 - global.players_spawned_from_meteors * 25000) >= 25000) {
                        global.players.push( new Player() )
                        global.players_spawned_from_meteors ++
                    }
                }

                drawHud()
                
                global.particles.push (new LaserParticle(
                    circle.position["x"], circle.position["y"],
                    circle.radius * 1.3, circle.colour, particleCtx
                ))

                global.circles = global.circles.filter(temp_circle => temp_circle.ID != circle.ID)
                if ( circle.size_index + 1 < meteor_sizes.length ) {
                    const meteor_count = 3
                    const random_angle = randFloat(0, Math.PI * 2)
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
/* offset the speed based on the laser's power      */    + Math.min(1, global.players_last_shot_laser_power / 2000)
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

function drawCoins() {
    global.coins.forEach((coin) => {
        coin.draw()
        global.players.forEach((player) => {
            if ( circleOverlapping(coin, player) ) {
                if ( coin.picked_up != true ) {
                    coin.picked_up = true
                    pickUpCoin(player)
                    global.coins = global.coins.filter(tempCoin => tempCoin.ID != coin.ID)
                }
            }
        })
    })
}

function pickUpCoin(player) {
    console.log("shiny")
    
    global.score += 20000
    global.save_data.coins += 1
    global.coins_picked_up_this_round ++
    drawHud()

    setCookie("save_data", global.save_data)

    spawnNewCoin(player)
    spawnNewCircleOutOfBounds()

    for (let i = 0; i < 25; i ++) {
        // allow the shield to be overloaded above 100, at a deminishing rate, but no more than 150
        if ( player.shield_health < 100 ) {
            player.shield_health += 1
        } else if ( player.shield_health > 150 ) {
        } else {
            player.shield_health += 1 / ((player.shield_health - 50) / 30)
        }
    }

    // store upgrades
    if ( hasUpgrade("clone_every_1_coins") ) {
        global.players.push( new Player() )
    } else {
        if ( hasUpgrade("clone_every_5_coins") ) {
            if ( global.coins_picked_up_this_round % 5 == 0 ) {
                global.players.push( new Player() )
            }
        } else {
            if ( hasUpgrade("clone_first_5_coins")) {
                if ( global.coins_picked_up_this_round == 5 ) {
                    global.players.push( new Player() )
                }
            }
        }
    }
}

function spawnNewCoin(player) {
    const target_x = Math.max(global.coin_radius, Math.min(ctx.canvas.width - global.coin_radius, (
        player.position["x"] + randFloat(ctx.canvas.width * 0.3, ctx.canvas.width * 0.4)
    ) % ctx.canvas.width))
    const target_y = Math.max(global.coin_radius, Math.min(ctx.canvas.height - global.coin_radius, (
        player.position["y"] + randFloat(ctx.canvas.height * 0.3, ctx.canvas.height * 0.4)
    ) % ctx.canvas.height))

    spawnNewCoinAtPos(target_x, target_y)
    // spawnCircleAtPos(target_x, target_y)
}

function spawnNewCoinAtPos(x, y) {
    global.coins.push(new Coin(x, y))
}

// unused
function spawnCircleAtPos(x, y) {
    global.circles.push(
        new Circle(
            randInt(0, meteor_sizes.length),
            {
                "x": x + randInt(-100, 200),
                "y": y + randInt(-100, 200)
            }
        )
    )
}

function spawnNewCircleOutOfBounds() {
    const spawn_side_random_value = Math.random()
    let circle_pos
    if ( spawn_side_random_value < 0.25 ) {
        circle_pos = {
            "x": ctx.canvas.width + 150,
            "y": randFloat(40, ctx.canvas.height - 80)
        }
    } else if ( spawn_side_random_value < 0.50 ) {
        circle_pos = {
            "x": -150,
            "y": randFloat(40, ctx.canvas.height - 80)
        }
    } else if ( spawn_side_random_value < 0.75 ) {
        circle_pos = {
            "x": randFloat(40, ctx.canvas.width - 80),
            "y": ctx.canvas.height + 150
        }
    } else {
        circle_pos = {
            "x": randFloat(40, ctx.canvas.width - 80),
            "y": -150
        }
    }

    const target_pos = {
        "x": ctx.canvas.width / 2 + randFloat(-200, 400),
        "y": ctx.canvas.height / 2 + randFloat(-200, 400)
    }

    const target_direction = Math.PI*0 + Math.atan2(
        target_pos["y"] - circle_pos["y"],
        target_pos["x"] - circle_pos["x"]
    )


    const new_circle = new Circle(
        randInt(0, meteor_sizes.length),
        circle_pos,
        target_direction, randFloat(0.5, 1)
    )


    new_circle.wrap_around = false

    global.circles.push(new_circle)
}

function removeCompletedParticles() {
    global.particles = global.particles.filter(particle => particle.isComplete == false)
}

// sort the global.circles array based on the `radius` property of the circles, meaning that the bigger circles get drawn last
function sortCircleArray() {
    global.circles.sort((a, b) => a.radius - b.radius)
}

function updateBackground() {
    drawBackgroundImage(backgroundCtx, global.assets["sprite_background"])
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
        console.log(`player save data: ${JSON.stringify(global.save_data)}`)
        console.log(`player settings data: ${JSON.stringify(getCookie("settings_data"))}`)

        await loadMenu()

        console.log("setup fully complete!")
    }
}, 100)

export async function stop_game() {
    console.log("stopping game...")
    global.is_playing = false

    ctx.canvas.hidden = true
    particleCtx.canvas.hidden = true
    hudCtx.canvas.hidden = true

    console.log("unregistering game ticks...")
    clearInterval(gameTick10)
    clearInterval(gameTick2)

    console.log("resetting global variables...")
    requestAnimationFrame(initGlobal)

    console.log("displaying game over screen...")
    showGameOverScreen(global.score, 12, 1924)

    console.log("set..down? complete!")
}

export function play_game() {
    global.is_playing = true

    // re-check settings and stuff
    if ( settings.visible_audio_players ) {
        for (const [key] of Object.entries(global.assets)) {
            
            // if the asset has a function updateVisibilty, call it
            const asset = global.assets[key]
            if ( typeof asset.updateVisibilty == "function" ) {
                asset.updateVisibilty()
            }
        }
    }

    ctx.canvas.hidden = false
    particleCtx.canvas.hidden = false
    hudCtx.canvas.hidden = false

    console.log("running ready() function...")
    ready()
    console.log("running first tick...")
    process()

    // stop_game()
}