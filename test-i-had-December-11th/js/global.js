import { loadAssets } from "./my_library/my_library.js";
import { InputManager } from "./my_library/input_manager.js";

const canvas = document.getElementById("gameCanvas");
const particlesCanvas = document.getElementById("particleCanvas");
const backgroundCanvas = document.getElementById("backgroundCanvas");
const hudCanvas = document.getElementById("hudCanvas");
const ctx = canvas.getContext("2d");
const particleCtx = particlesCanvas.getContext("2d");
const backgroundCtx = backgroundCanvas.getContext("2d");
const hudCtx = hudCanvas.getContext("2d");

class Global {
    constructor(asset_objects, asset_bonus_data) {
        this.entity_counter = 0;

        this.frames_processed = 0;
        this.is_playing = false;

        this.score = 0;

        this.entities = {
            players: [],
            squares: [],
            targets: [],
            projectiles: [],
        };

        this.assets = asset_objects;
        this.asset_bonus_data = asset_bonus_data;
    }
}

// set these to null for now so that they can be properly exported
var global = null;
var inputManager = null;

var asset_objects;
var asset_bonus_data;

window.onload = async function () {
    console.log("initializing input manager...");
    inputManager = new InputManager(ctx.canvas);
    console.log("loading assets...");
    // assets, defined with:
    // "ID": [Type of asset, "path to file", Bonus data]
    let asset_data = await loadAssets({
        sprite_background: [Image, "assets/sprites/kenney/Backgrounds/darkPurple.png", {}],
    });
    asset_objects = asset_data[0];
    asset_bonus_data = asset_data[1];
    console.log("completed loading all assets!");

    // asset_objects["sfx_laser_small"].updateVolume(0.7)
    // asset_objects["sfx_space_engine_2"].updateVolume(0.3)
    // asset_objects["sfx_space_engine_2"].loop(true)
    // console.log("completed fixing audio levels")

    await initGlobal();
    console.log("completed initiating global varibles!");
};

export async function initGlobal() {
    console.log("initing global variabes...");
    global = new Global(asset_objects, asset_bonus_data);
}

export { ctx, particleCtx, backgroundCtx, hudCtx, global, inputManager };
