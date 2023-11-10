const developer_screen_size_width = 1920
const developer_screen_size_height = 1080

const biggest_developer_size_dimension = Math.max(developer_screen_size_width, developer_screen_size_height)
const biggest_user_size_dimension = Math.max(window.innerWidth, window.innerHeight)

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
    return hexToRgba + "ff"
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

// function to make sure all the needed images are loaded before we try to use them
export async function loadImages(imageSources) {
    return new Promise(resolve => {
        let imageObjects = []
        let imageReady = []
        for (let i = 0; i < imageSources.length; i ++) {
            imageObjects.push(new Image)
            imageReady.push(false)

            imageObjects[i].onload = function() {
                imageReady[i] = true
            }

            imageObjects[i].src = imageSources[i]
        }

        function isComplete() {
            // loop over the images, if any aren't loaded, break
            for (let i = 0; i < imageObjects.length; i ++) {
                if (imageReady[i] == false) {
                    break
                }
                
                // stop the function from executing
                clearInterval(isComplete)
                // return the imageObjects
                resolve(imageObjects)
            }
        }

        // set a function to check if all the images are properly loaded every 100 ms
        setInterval(isComplete, 100)
    })
}