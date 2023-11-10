const developer_screen_size_width = 1920
const developer_screen_size_height = 1080

const biggest_developer_size_dimension = Math.max(developer_screen_size_width, developer_screen_size_height)
const biggest_user_size_dimension = Math.max(window.innerWidth, window.innerHeight)

var user_current_screen_width = 1
var user_current_screen_height = 1

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
        let assetReady = {}
        for (const [key, value] of Object.entries(assetSources)) {
            // handling images
            if (value[1] == Image) {
                assetObjects[key] = new Image
                assetReady[key] = false


                assetObjects[key].onload = function() {
                    console.log(`[ASSETS] [IMAGE] ${key} is done loading`)
                    assetReady[key] = true
                }

                assetObjects[key].src = value[0]
            }
            // handling audio
            else if (value[1] == Audio) {
                assetObjects[key] = new sound(value[0])
                assetReady[key] = true
            }
            // if it's none of the above
            else {
                console.log(`format for ${key} was set to ${value[1]}, which is not a valid option`)
                alert(`format for ${key} was set to ${value[1]}, which is not a valid option`)
            }

        }

        function isComplete() {
            // loop over the images, if any aren't loaded, break
            for (const [key, value] of Object.entries(assetReady)) {
                if (value == false) {
                    return
                }

            }
            // stop the function from executing
            clearInterval(isComplete)
            // return the assetObjects
            resolve(assetObjects)
        }

        // set a function to check if all the images are properly loaded every 100 ms
        setInterval(isComplete, 100)
    })
}

export function resizeCanvas(canvas) {
    if (user_current_screen_width != window.innerWidth || user_current_screen_height != window.innerHeight) {
        console.log("resizing canvas...")
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        
        user_current_screen_width = window.innerWidth
        user_current_screen_height = window.innerHeight
    }
}




// """" custom data types """"

export function sound(src) {
    this.sound = document.createElement("audio")
    this.sound.src = src
    this.sound.setAttribute("preload", "auto")
    this.sound.setAttribute("controls", "none")
    document.getElementById("misc").appendChild(this.sound)

    this.play = function(){
        this.sound.play()
    }
    this.stop = function(){
        this.sound.pause()
    }
    this.loop = function(bool){
        this.sound.loop = bool
        if (bool === true) {
            this.sound.classList.add("looping-audio")
        } else if (bool === false) {
            this.sound.classList.remove("looping-audio")
        }
    }
} 
