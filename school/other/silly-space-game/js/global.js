import { accountForDisplay, loadAssets } from "./tems_library.js"

const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

class Global {
    constructor(assetObjects) {
        // adjust everything depending on the screen's largest dimension, for a consistent experience accross displays
        this.circle_radius_rand = accountForDisplay(20)
        this.circle_radius_offset = accountForDisplay(12)
        this.circle_speed_rand = accountForDisplay(0.2)
        this.circle_speed_offset = accountForDisplay(0.03)

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
    }
}

var global = null

window.onload = async function() {
    console.log("loading images..")
    // assets, defined with:
    // "ID": ["path to file", Type of asset] 
    let assetObjects = await loadAssets({
        "sprite_background": ["../assets/sprites/ulukai/background.png", Image],
        "music_battle": ["../assets/audio/music/meteor/meteor_fight_cut.ogg", Audio],
        "sound_laserLarge": ["../assets/audio/sound-effects/kenney_sci-fi-sounds/Audio/laserLarge_001.ogg", Audio],
        "sound_laserSmall": ["../assets/audio/sound-effects/kenney_sci-fi-sounds/Audio/laserSmall_001.ogg", Audio],
        "sound_spaceEngine2": ["../assets/audio/sound-effects/kenney_sci-fi-sounds/Audio/spaceEngine_002.ogg", Audio],
        "sound_spaceEngine3": ["../assets/audio/sound-effects/kenney_sci-fi-sounds/Audio/spaceEngine_003.ogg", Audio],
    })
    console.log("completed loading images!")
    
    global = new Global(assetObjects)
    console.log("completed initiating global varibles!")
}

export { canvas, ctx, global }