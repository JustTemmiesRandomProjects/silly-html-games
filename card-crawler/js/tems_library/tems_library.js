import { ctx, global } from "../global.js"
import { settings } from "./settings.js"
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