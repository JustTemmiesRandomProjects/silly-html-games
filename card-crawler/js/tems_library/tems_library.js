import { settings } from "./settings.js"
import { ctx } from "../global.js"
import { global } from "../global.js"
import { GIF, customImage, sound } from "./custom_data_types.js"

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
    ]
}

// function that adjusts a number to match the screen size
export function accountForDisplay(num) {
    return num * (biggest_user_size_dimension / biggest_developer_size_dimension)
}

// python time.sleep function
export async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

export function arrayContainsElement(array, element) {
    array.forEach((entry) => {
        if ( element == entry ) {
            return true
        }
    })

    return false
}

export function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
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

            // gif, a custom format
            if ( value[0] == GIF ) {
                assetReady[key] = false
                assetObjects[key] = new GIF(value[1], ctx, function () {
                    console.log(`[ASSETS] [GIF] ${key} is done loading`)
                    assetReady[key] = true
                })
            }

            else if ( value[0] == customImage ) {
                assetReady[key] = false
                assetObjects[key] = new customImage(value[1], ctx, function () {
                    console.log(`[ASSETS] [customImage] ${key} is done loading`)
                    assetReady[key] = true
                })
            }

            // handling images
            else if ( value[0] == Image ) {
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

export function resizeCanvas(contexts, callbackFunctions) {
    if (user_current_screen_height != 963) {
        console.log("resizing canvas...")
        for (let i = 0; i < contexts.length; i++) {
            const context = contexts[i]
            context.canvas.width = 1920
            context.canvas.height = 963

            if (context instanceof WebGL2RenderingContext) {
                console.debug(`updating WebGL context to 0, 0, ${context.canvas.width}, ${context.canvas.height}`)
                context.viewport(0, 0, context.canvas.width, context.canvas.height);
            }
        }

        user_current_screen_width = 1920
        user_current_screen_height = 963

        canvas_centre = [ctx.canvas.width / 2, ctx.canvas.height / 2]
        
        if (callbackFunctions != undefined) {
            callbackFunctions.forEach(element => {
                element()
            })
        }
    }
}

export function call_deferred(namespace, func, optional_arguments) {
    if ( optional_arguments == undefined ) { optional_arguments = [] }
    global.deferred_calls.push({namespace, func, optional_arguments})
}