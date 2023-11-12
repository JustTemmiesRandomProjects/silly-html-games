import { accountForDisplay, loadAssets } from "./tems_library/tems_library.js"

const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

class Global {
    constructor(assetObjects, assetBonusData) {
        // adjust everything depending on the screen's largest dimension, for a consistent experience accross displays
        this.circle_radius_rand = accountForDisplay(20)
        this.circle_radius_offset = accountForDisplay(12)
        this.circle_speed_rand = accountForDisplay(0.25)
        this.circle_speed_offset = accountForDisplay(0.05)

        this.circle_count = 20

        this.circles = []

        this.colours = [
            "#8000808F",
            "#FFD5008F",
            "#FF971C8F",
            "#0341AE8F",
            "#F000008F",
            "#72CB3B8F",
            "#00F0F08F"
        ]

        this.assets = assetObjects
        this.assetBonusData = assetBonusData
    }
}

var global = null

window.onload = async function () {
    console.log("loading images...")
    // assets, defined with:
    // "ID": [Type of asset, "path to file", Bonus data] 
    let assetData = await loadAssets({
        "sprite_background":                [Image, "../assets/sprites/kenney_space-shooter-redux/Backgrounds/darkPurple.png", {}],
        "sprite_meteor_big_1":              [Image, "../assets/sprites/kenney_space-shooter-redux/PNG/Meteors/meteorBrown_big1.png", {"hitboxRadius": 40, "hitboxColour": "#ff606060"}],
        "sprite_meteor_big_2":              [Image, "../assets/sprites/kenney_space-shooter-redux/PNG/Meteors/meteorBrown_big2.png", {"hitboxRadius": 46, "hitboxColour": "#ff006060"}],
        "sprite_meteor_big_3":              [Image, "../assets/sprites/kenney_space-shooter-redux/PNG/Meteors/meteorBrown_big3.png", {"hitboxRadius": 39, "hitboxColour": "#ff600060"}],
        "sprite_meteor_big_4":              [Image, "../assets/sprites/kenney_space-shooter-redux/PNG/Meteors/meteorBrown_big4.png", {"hitboxRadius": 41, "hitboxColour": "#ff000060"}],
        "sprite_meteor_med_1":              [Image, "../assets/sprites/kenney_space-shooter-redux/PNG/Meteors/meteorBrown_med1.png", {"hitboxRadius": 20, "hitboxColour": "#ff600060"}],
        "sprite_meteor_med_2":              [Image, "../assets/sprites/kenney_space-shooter-redux/PNG/Meteors/meteorBrown_med2.png", {"hitboxRadius": 20, "hitboxColour": "#ff000060"}],
        "sprite_meteor_small_1":            [Image, "../assets/sprites/kenney_space-shooter-redux/PNG/Meteors/meteorBrown_small1.png", {"hitboxRadius": 11, "hitboxColour": "#ff600060"}],
        "sprite_meteor_small_2":            [Image, "../assets/sprites/kenney_space-shooter-redux/PNG/Meteors/meteorBrown_small2.png", {"hitboxRadius": 11, "hitboxColour": "#ff000060"}],
        "sprite_meteor_tiny_1":             [Image, "../assets/sprites/kenney_space-shooter-redux/PNG/Meteors/meteorBrown_tiny1.png", {"hitboxRadius": 5, "hitboxColour": "#ff600060"}],
        "sprite_meteor_tiny_2":             [Image, "../assets/sprites/kenney_space-shooter-redux/PNG/Meteors/meteorBrown_tiny2.png", {"hitboxRadius": 5, "hitboxColour": "#ff000060"}],
        "music_fight":                      [Audio, "../assets/audio/music/meteor/music_meteor_fight_cut.ogg", {}],
        "sfx_laser_large":                  [Audio, "../assets/audio/sound-effects/kenney/sfx_laserLarge_001.ogg", {}],
        "sfx_laser_small":                  [Audio, "../assets/audio/sound-effects/kenney/sfx_laserSmall_001.ogg", {}],
        "sfx_space_engine_2":               [Audio, "../assets/audio/sound-effects/kenney/sfx_spaceEngine_002.ogg", {}],
        "sfx_space_engine_3":               [Audio, "../assets/audio/sound-effects/kenney/sfx_spaceEngine_003.ogg", {}],
        "sfx_shield_down":                  [Audio, "../assets/audio/sound-effects/kenney/sfx_shieldDown.ogg", {}],
        "sfx_shield_up":                    [Audio, "../assets/audio/sound-effects/kenney/sfx_shieldUp.ogg", {}],
        "sfx_two_tone":                     [Audio, "../assets/audio/sound-effects/kenney/sfx_twoTone.ogg", {}],
        "sfx_zap":                          [Audio, "../assets/audio/sound-effects/kenney/sfx_zap.ogg", {}],
        "sfx_lose":                         [Audio, "../assets/audio/sound-effects/kenney/sfx_lose.ogg", {}],
    })
    let assetObjects = assetData[0]
    let assetBonusData = assetData[1]
    console.log("completed loading images!")

    global = new Global(assetObjects, assetBonusData)
    console.log("completed initiating global varibles!")
}

export { canvas, ctx, global }