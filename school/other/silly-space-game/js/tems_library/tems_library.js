import { settings } from "./settings.js"
import { ctx } from "../global.js"

const developer_screen_size_width = 1920
const developer_screen_size_height = 1080

const biggest_developer_size_dimension = Math.max(developer_screen_size_width, developer_screen_size_height)
var biggest_user_size_dimension = Math.max(window.innerWidth, window.innerHeight)

var user_current_screen_width = 1
var user_current_screen_height = 1

export var canvas_centre = [ctx.canvas.width / 2, ctx.canvas.height / 2]

// generate a random integer, from 0 (inclusive) to multiplier (exclusive)
export function randInt(offset, multiplier) {
    return Math.floor((Math.random() * multiplier) + offset)
}

export function randFloat(offset, multiplier) {
    return Math.random() * multiplier + offset
}

export function rgbToHex(rgb) {
    // add the alpha layer
    return rgbaToHex(rgb.push(255))
}

export function rgbaToHex(rgba) {
    return (
        "#"
        + (rgba[0]).toString(16).padStart(2, "0")
        + (rgba[1]).toString(16).padStart(2, "0")
        + (rgba[2]).toString(16).padStart(2, "0")
        + (rgba[3]).toString(16).padStart(2, "0")
    )
}

export function hexToRgb(hex) {
    // add "ff" to the alpha layer
    return hexToRgba(hex + "ff")
}

export function hexToRgba(hex) {
    // remove the hash if it exists
    hex = hex.replace(/^#/, '')

    // parse the hex value to an integer
    var bigint = parseInt(hex, 16)

    // extract the RGB components and return them
    return [
        (bigint >> 24) & 255,
        (bigint >> 16) & 255,
        (bigint >> 8) & 255,
        bigint & 255,
    ];
}

// function that adjusts a number to match the screen size
export function accountForDisplay(num) {
    return num * (biggest_user_size_dimension / biggest_developer_size_dimension)
}

// python time.sleep function
export async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}


// function to make sure all the needed assets are loaded before we try to use them
export async function loadAssets(assetSources) {
    return new Promise(resolve => {
        let assetObjects = {}
        let asset_bonus_data = {}
        let assetReady = {}
        for (const [key, value] of Object.entries(assetSources)) {
            // stuff for all formats
            asset_bonus_data[key] = assetSources[key][2]

            // handling images
            if (value[0] == Image) {
                assetObjects[key] = new Image
                assetReady[key] = false


                assetObjects[key].onload = function () {
                    console.log(`[ASSETS] [IMAGE] ${key} is done loading`)
                    assetReady[key] = true
                }

                assetObjects[key].src = value[1]
            }

            // handling audio
            else if (value[0] == Audio) {
                assetObjects[key] = new sound(value[1], key)
                assetReady[key] = true
            }

            // if it's none of the above
            else {
                console.log(`format for ${key} was set to ${value[0]}, which is not a valid option`)
                alert(`format for ${key} was set to ${value[0]}, which is not a valid option`)
            }

        }

        // make sure assets are loaded
        function isComplete() {
            // loop over the images, if any aren't loaded, break
            for (const [key, value] of Object.entries(assetReady)) {
                if (value == false) {
                    return
                }

            }
            // stop the function from executing
            clearInterval(isComplete)
            // return the data
            resolve([assetObjects, asset_bonus_data])
        }

        // set a function to check if all the images are properly loaded every 100 ms
        setInterval(isComplete, 100)
    })
}

export function resizeCanvas(canvas, background = null) {
    if (user_current_screen_width != window.innerWidth || user_current_screen_height != window.innerHeight) {
        console.log("resizing canvas...")
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        user_current_screen_width = window.innerWidth
        user_current_screen_height = window.innerHeight

        canvas_centre = [ctx.canvas.width / 2, ctx.canvas.height / 2]
        
        // stuff for rending the background canvas
        if ( background != null ) {
            background[0].canvas.width = window.innerWidth
            background[0].canvas.height = window.innerHeight
            drawBackgroundImage(background[0], background[1])
        }
    }
}

// draw an image to cover the screen, crop the image if needed to fill the screen
// the transformations took me too fucking long lmao
export function drawBackgroundImage(context, image) {
    console.log("drawing background...")
    const scale = Math.max(
        context.canvas.width / image.width,
        context.canvas.height / image.height
    )

    //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform
    context.setTransform(
      /*     scale x */ scale,
      /*      skew x */ 0,
      /*      skew y */ 0,
      /*     scale y */ scale,
      /* translate x */(context.canvas.width - scale * image.width) / 2,
      /* translate y */(context.canvas.height - scale * image.height) / 2,
    )

    context.drawImage(image, 0, 0)
    // reset the transformation back to the default
    context.setTransform(1, 0, 0, 1, 0, 0);
}




// """" custom data types """"

// SOUND
export function sound(src, key) {
    if (!key.includes("_")) {
        console.log(`the ID ${key} isn't valid, it needs to have a category, like "sound_" or "music_" before the actual name`)
        alert(`the ID ${key} isn't valid, it needs to have a category, like "sound_" or "music_" before the actual name`)
        return
    }

    this.category = key.split("_")[0]
    if (settings.volume_mixer[this.category] == undefined) {
        console.log(`the category "${this.category}" was not found in settings.volume_mixer, this is not a valid category for ${key}`)
        alert(`the category "${this.category}" was not found in settings.volume_mixer, this is not a valid category for ${key}`)
    }

    // functions
    this.play = function () {
        this.sound.play()
    }
    this.stop = function () {
        this.sound.pause()
    }
    this.loop = function (bool) {
        this.sound.loop = bool
        // make sure the "looping-audio" html class is matching it's current state
        if (bool === true) {
            this.sound.classList.add("looping-audio")
        } else if (bool === false) {
            this.sound.classList.remove("looping-audio")
        }
    }
    this.setVolume = function () {
        this.sound.volume =
            // ensure that the volume never goes above 1, or below 0
            Math.max(0,
                Math.min(1,
                    // number between 1 and 0, specific for this audio category
                    settings.volume_mixer[this.category]
                    // the master volume, if this is at 0.5, it will halve the sound of all audio players
                    * settings.volume_mixer["master"]
                )
            )
    }

    // create the HTML audio player
    this.sound = document.createElement("audio")
    this.sound.src = src
    this.sound.setAttribute("preload", "auto")
    this.sound.setAttribute("controls", "none")

    // hide the audo players according to the settings
    if (!settings.visible_audio_players) {
        this.sound.style = "display: none;"
    }
    // get the "misc" div, and add the html audio player to it
    document.getElementById("misc").appendChild(this.sound)

    // audio mixer
    this.setVolume()

    console.log(`[ASSETS] [${this.category.toUpperCase()}] ${key} is done loading`)
}



