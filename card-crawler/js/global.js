import { InputManager } from "./tems_library/input_manager.js"
import { GIF, customImage, loadAssets } from "./tems_library/custom_data_types.js"

const canvas = document.getElementById("gameCanvas")
const particlesCanvas = document.getElementById("particleCanvas")
const backgroundCanvas = document.getElementById("backgroundCanvas")
const hudCanvas = document.getElementById("hudCanvas")
const debugHudCanvas = document.getElementById("debugHudCanvas")
const WebGLHudCanvas = document.getElementById("WebGLHudCanvas")
const focusingCardCanvas = document.getElementById("focusingCardCanvas")
const WebGLTopCanvas = document.getElementById("WebGLTopCanvas")
export const ctx = canvas.getContext("2d")
export const particleCtx = particlesCanvas.getContext("2d")
export const backgroundCtx = backgroundCanvas.getContext("2d")
export const hudCtx = hudCanvas.getContext("2d")
export const debugHudCtx = debugHudCanvas.getContext("2d")
export const WebGLHudCtx = WebGLHudCanvas.getContext("webgl2")
export const focusingCardCtx = focusingCardCanvas.getContext("2d")
export const WebGLTopCtx = WebGLTopCanvas.getContext("webgl2")


class Global {
    constructor(asset_objects, asset_bonus_data) {
        this.entity_counter = 0
        this.frames_processed = 0
        this.delta_time = 1
        this.average_delta_time = 1
        
        this.last_frame_timestamp = window.performance.now()
        this.frame_times = []
        this.loaded_entities = 0

        this.is_playing = false
        this.is_focused = true

        this.debug_mode = true

        this.score = 0

        this.player = null
        this.current_room = null
        
        
        this.entities = {
            backgrounds: [],
            hud: [],
            actors: [],
            cards: [],
            shaders: [],
            misc: [],
        }
        this.last_rooms = {}

        // functions to run after the ticks are done processing
        this.deferred_calls = []

        this.assets = asset_objects
        this.asset_bonus_data = asset_bonus_data
    }
}

// set these to null for now so that they can be properly exported
var global = null
var inputManager = null

var asset_objects
var asset_bonus_data

if (!WebGLHudCtx) {
    console.error('WebGL not supported');
    alert("WebGL is not supported by your current browser, this game won't work")
}

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

        "sprite_icon_sword": [customImage, ["assets/sprites/pixabay/sword.svg"], {}],
        "sprite_player_idle": [GIF, ["assets/sprites/kenney/kenney_tiny-ski/ski_idle.png"], {}],
        "sprite_player_active": [GIF, [
            "assets/sprites/kenney/kenney_tiny-ski/ski_walk.png",
            "assets/sprites/kenney/kenney_tiny-ski/ski_idle.png",
        ], {}]
    }, ctx)
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

export {global, inputManager}