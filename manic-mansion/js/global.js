import { GIF, accountForDisplay, loadAssets } from "./tems_library/tems_library.js"
import { InputManager } from "./tems_library/input_manager.js"

const canvas = document.getElementById("gameCanvas")
const particlesCanvas = document.getElementById("particleCanvas")
const backgroundCanvas = document.getElementById("backgroundCanvas")
const hudCanvas = document.getElementById("hudCanvas")
const ctx = canvas.getContext("2d")
const particleCtx = particlesCanvas.getContext("2d")
const backgroundCtx = backgroundCanvas.getContext("2d")
const hudCtx = hudCanvas.getContext("2d")

class Global {
    constructor(asset_objects, asset_bonus_data) {
        this.entity_counter = 0
        
        this.player_acceleration = accountForDisplay(0.5)
        this.player_max_speed = accountForDisplay(5)
        this.player_slipperiness = 0.90

        this.ghost_acceleration = accountForDisplay(0.3)
        this.ghost_max_speed = accountForDisplay(2)
        this.ghost_slipperiness = 0.97
        this.frames_processed = 0
        this.is_playing = false

        this.score = 0

        this.entities = {
            backgrounds: [],
            players: [],
            misc: [],
            ghosts: [],
        }

        this.assets = asset_objects
        this.asset_bonus_data = asset_bonus_data
    }
}

// set these to null for now so that they can be properly exported
var global = null
var inputManager = null

var asset_objects
var asset_bonus_data

window.onload = async function () {
    console.log("initializing input manager...")
    inputManager = new InputManager(ctx.canvas)
    console.log("loading assets...")
    // assets, defined with:
    // "ID": [Type of asset, "path to file", Bonus data] 
    let asset_data = await loadAssets({
        "sprite_background": [Image, "assets/sprites/kenney/Backgrounds/black.png", {}],
        "sprite_space_coin": [GIF, [
            "assets/sprites/original/space-coin-1.png", "assets/sprites/original/space-coin-2.png",
            "assets/sprites/original/space-coin-3.png", "assets/sprites/original/space-coin-4.png",
            "assets/sprites/original/space-coin-5.png", "assets/sprites/original/space-coin-6.png",
            "assets/sprites/original/space-coin-7.png", "assets/sprites/original/space-coin-8.png",
        ], {}],
        "sfx_zap": [Audio, "assets/audio/sound-effects/kenney/sfx_zap.ogg", {}],

        "sprite_player_idle": [Image, "assets/sprites/kenney/kenney_tiny-ski/ski_idle.png", {}],
        "sprite_player_active": [GIF, [
            "assets/sprites/kenney/kenney_tiny-ski/ski_walk.png",
            "assets/sprites/kenney/kenney_tiny-ski/ski_idle.png",
        ], {}],
        "sprite_ghost": [GIF, [
            "assets/sprites/ghosts/ghost0.png", "assets/sprites/ghosts/ghost1.png",
            "assets/sprites/ghosts/ghost2.png", "assets/sprites/ghosts/ghost3.png",
        ], {}],
    })
    asset_objects = asset_data[0]
    asset_bonus_data = asset_data[1]
    console.log("completed loading all assets!")

    // asset_objects["sfx_laser_small"].updateVolume(0.7)
    // asset_objects["sfx_space_engine_2"].updateVolume(0.3)
    // asset_objects["sfx_space_engine_2"].loop(true)
    // console.log("completed fixing audio levels")

    await initGlobal()
    console.log("completed initiating global varibles!")
}

export async function initGlobal() {
    console.log("initing global variabes...")
    global = new Global(asset_objects, asset_bonus_data)
}

export { ctx, particleCtx, backgroundCtx, hudCtx, global, inputManager }