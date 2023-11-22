import { GIF, accountForDisplay, loadAssets } from "./tems_library/tems_library.js"
import { InputManager } from "./tems_library/input_manager.js"

const canvas = document.getElementById("gameCanvas")
const particlesCanvas = document.getElementById("particleCanvas")
const backgroundCanvas = document.getElementById("backgroundCanvas")
const ctx = canvas.getContext("2d")
const particleCtx = particlesCanvas.getContext("2d")
const backgroundCtx = backgroundCanvas.getContext("2d")

class Global {
    constructor(asset_objects, asset_bonus_data) {
        // adjust everything depending on the screen's largest dimension, for a consistent experience accross displays
        this.circle_speed_rand = accountForDisplay(0.13)
        this.circle_speed_offset = accountForDisplay(0.02)

        this.circle_count = 40
        this.player_spawn_safe_radius = 350
        // just a counter used to set a unique ID for every circle
        this.next_circle_ID = 0

        this.player_acceleration = accountForDisplay(0.3)
        this.player_max_speed = accountForDisplay(5)
        this.player_slipperiness = 0.97
        this.players_last_shot_laser_power = 0

        this.circles = []
        this.players = []
        this.lasers = []
        this.particles = []

        this.assets = asset_objects
        this.asset_bonus_data = asset_bonus_data

    }
}

// set these to null for now so that they can be properly exported
var global = null
var inputManager = null

window.onload = async function () {
    console.log("initializing input manager...")
    inputManager = new InputManager(ctx.canvas)
    console.log("loading assets...")
    // assets, defined with:
    // "ID": [Type of asset, "path to file", Bonus data] 
    let asset_data = await loadAssets({
        "sprite_background":                [Image, "assets/sprites/kenney/Backgrounds/darkPurple.png",                      {}],
        "sprite_meteor_big_1":              [Image, "assets/sprites/kenney/Meteors/meteorBrown_big1.png",                    { "hitboxRadius": 40, "hitboxColour": "#ff606060" }],
        "sprite_meteor_big_2":              [Image, "assets/sprites/kenney/Meteors/meteorBrown_big2.png",                    { "hitboxRadius": 46, "hitboxColour": "#ff006060" }],
        "sprite_meteor_big_3":              [Image, "assets/sprites/kenney/Meteors/meteorBrown_big3.png",                    { "hitboxRadius": 39, "hitboxColour": "#ff600060" }],
        "sprite_meteor_big_4":              [Image, "assets/sprites/kenney/Meteors/meteorBrown_big4.png",                    { "hitboxRadius": 41, "hitboxColour": "#ff000060" }],
        "sprite_meteor_med_1":              [Image, "assets/sprites/kenney/Meteors/meteorBrown_med1.png",                    { "hitboxRadius": 20, "hitboxColour": "#ff600060" }],
        "sprite_meteor_med_2":              [Image, "assets/sprites/kenney/Meteors/meteorBrown_med2.png",                    { "hitboxRadius": 20, "hitboxColour": "#ff000060" }],
        "sprite_meteor_small_1":            [Image, "assets/sprites/kenney/Meteors/meteorBrown_small1.png",                  { "hitboxRadius": 11, "hitboxColour": "#ff600060" }],
        "sprite_meteor_small_2":            [Image, "assets/sprites/kenney/Meteors/meteorBrown_small2.png",                  { "hitboxRadius": 11, "hitboxColour": "#ff000060" }],
        "sprite_meteor_tiny_1":             [Image, "assets/sprites/kenney/Meteors/meteorBrown_tiny1.png",                   { "hitboxRadius": 5, "hitboxColour": "#ff600060" }],
        "sprite_meteor_tiny_2":             [Image, "assets/sprites/kenney/Meteors/meteorBrown_tiny2.png",                   { "hitboxRadius": 5, "hitboxColour": "#ff000060" }],
        "sprite_player_ship_1_blue":        [Image, "assets/sprites/kenney/Player/playerShip1_blue.png",                     { "hitboxColour": "#40505050" }],
        "sprite_player_ship_1_green":       [Image, "assets/sprites/kenney/Player/playerShip1_green.png",                    { "hitboxColour": "#40505050" }],
        "sprite_player_ship_1_orange":      [Image, "assets/sprites/kenney/Player/playerShip1_orange.png",                   { "hitboxColour": "#40505050" }],
        "sprite_player_ship_1_red":         [Image, "assets/sprites/kenney/Player/playerShip1_red.png",                      { "hitboxColour": "#40505050" }],
        "sprite_player_ship_2_blue":        [Image, "assets/sprites/kenney/Player/playerShip2_blue.png",                     { "hitboxColour": "#40505050" }],
        "sprite_player_ship_2_green":       [Image, "assets/sprites/kenney/Player/playerShip2_green.png",                    { "hitboxColour": "#40505050" }],
        "sprite_player_ship_2_orange":      [Image, "assets/sprites/kenney/Player/playerShip2_orange.png",                   { "hitboxColour": "#40505050" }],
        "sprite_player_ship_2_red":         [Image, "assets/sprites/kenney/Player/playerShip2_red.png",                      { "hitboxColour": "#40505050" }],
        "sprite_player_ship_3_blue":        [Image, "assets/sprites/kenney/Player/playerShip3_blue.png",                     { "hitboxColour": "#40505050" }],
        "sprite_player_ship_3_green":       [Image, "assets/sprites/kenney/Player/playerShip3_green.png",                    { "hitboxColour": "#40505050" }],
        "sprite_player_ship_3_orange":      [Image, "assets/sprites/kenney/Player/playerShip3_orange.png",                   { "hitboxColour": "#40505050" }],
        "sprite_player_ship_3_red":         [Image, "assets/sprites/kenney/Player/playerShip3_red.png",                      { "hitboxColour": "#40505050" }],
        "sprite_space_coin":                [GIF,   "assets/sprites/original/space_coin.gif",                                {}],
        "music_fight":                      [Audio, "assets/audio/music/meteor/music_meteor_fight_cut.ogg",                  {}],
        "sfx_laser_large":                  [Audio, "assets/audio/sound-effects/kenney/sfx_laserLarge_001.ogg",              {}],
        "sfx_laser_small":                  [Audio, "assets/audio/sound-effects/kenney/sfx_laserSmall_001.ogg",              {}],
        "sfx_space_engine_2":               [Audio, "assets/audio/sound-effects/kenney/sfx_spaceEngine_002.ogg",             {}],
        "sfx_space_engine_3":               [Audio, "assets/audio/sound-effects/kenney/sfx_spaceEngine_003.ogg",             {}],
        "sfx_shield_down":                  [Audio, "assets/audio/sound-effects/kenney/sfx_shieldDown.ogg",                  {}],
        "sfx_shield_up":                    [Audio, "assets/audio/sound-effects/kenney/sfx_shieldUp.ogg",                    {}],
        "sfx_two_tone":                     [Audio, "assets/audio/sound-effects/kenney/sfx_twoTone.ogg",                     {}],
        "sfx_zap":                          [Audio, "assets/audio/sound-effects/kenney/sfx_zap.ogg",                         {}],
        "sfx_lose":                         [Audio, "assets/audio/sound-effects/kenney/sfx_lose.ogg",                        {}],
    })
    let asset_objects = asset_data[0]
    let asset_bonus_data = asset_data[1]
    console.log("completed loading images!")

    // asset_objects["sfx_laser_small"].updateVolume(0.7)
    // asset_objects["sfx_space_engine_2"].updateVolume(0.3)
    asset_objects["sfx_space_engine_2"].loop(true)
    console.log("completed fixing audio levels")

    global = new Global(asset_objects, asset_bonus_data)
    console.log("completed initiating global varibles!")

}

export { ctx, particleCtx, backgroundCtx, global, inputManager }