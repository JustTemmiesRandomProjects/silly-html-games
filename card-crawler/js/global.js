import { accountForDisplay, loadAssets } from "./tems_library/tems_library.js"
import { InputManager } from "./tems_library/input_manager.js"

import { CombatRoom } from "./classes/rooms/combat.js"
import { MiscRoom } from "./classes/rooms/misc.js"
import { GIF, customImage } from "./tems_library/custom_data_types.js"

const canvas = document.getElementById("gameCanvas")
const particlesCanvas = document.getElementById("particleCanvas")
const backgroundCanvas = document.getElementById("backgroundCanvas")
const hudCanvas = document.getElementById("hudCanvas")
const debugHudCanvas = document.getElementById("debugHudCanvas")
const hoveringCardCanvas = document.getElementById("hoveringCardCanvas")
const ctx = canvas.getContext("2d")
const particleCtx = particlesCanvas.getContext("2d")
const backgroundCtx = backgroundCanvas.getContext("2d")
const hudCtx = hudCanvas.getContext("2d")
const debugHudCtx = debugHudCanvas.getContext("2d")
const hoveringCardCtx = hoveringCardCanvas.getContext("2d")

class Global {
    constructor(asset_objects, asset_bonus_data) {
        this.entity_counter = 0
        this.frames_processed = 0
        this.delta_time = 1
        this.last_frame_timestamp = window.performance.now()
        this.frame_times = []

        this.is_playing = false
        this.is_focused = true

        this.debug_mode = false

        this.score = 0

        this.player = null
        this.current_room = null
        
        
        this.entities = {
            backgrounds: [],
            hud: [],
            actors: [],
            cards: [],
            misc: [],
        }

        // functions to run after the ticks are done processing
        this.deferred_calls = []


        this.assets = asset_objects
        this.asset_bonus_data = asset_bonus_data
    }

    setRoomType(room_type) {
        const ROOM_TYPES = [
            "combat",
            "misc",
        ]
    
        if (room_type == "combat") {
            this.current_room = new CombatRoom
            
        } else if (room_type == "misc") {
            this.current_room = new MiscRoom
    
        }
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
        "beaver": [customImage, "assets/sprites/original/beaver.svg", {}],
        "sfx_zap": [Audio, "assets/audio/sound-effects/kenney/sfx_zap.ogg", {}],

        "sprite_player_idle": [GIF, ["assets/sprites/kenney/kenney_tiny-ski/ski_idle.png"], {}],
        "sprite_player_active": [GIF, [
            "assets/sprites/kenney/kenney_tiny-ski/ski_walk.png",
            "assets/sprites/kenney/kenney_tiny-ski/ski_idle.png",
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

export { ctx, particleCtx, backgroundCtx, hudCtx, debugHudCtx, hoveringCardCtx, global, inputManager }