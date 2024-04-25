import { settings } from "./settings.js"

// SOUND
export function sound(src, key) {
    this.is_audio = true

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

    // functions for "unique" audio players
    this.play_unique = function () {
        // create the HTML audio player
        const temp_sound = document.createElement("audio")
        temp_sound.src = src
        temp_sound.setAttribute("preload", "auto")
        temp_sound.setAttribute("controls", "none")

        temp_sound.play()
        return temp_sound
    }
    this.stop_unique = function (audio_player) {
        audio_player.pause()
    }

    // other helper functions
    this.play = function () {
        this.sound.play()
    }
    this.pause = function () {
        this.sound.pause()
    }
    this.stop = function () {
        this.sound.currentTime = 0
        this.sound.pause()
    }
    this.updateVisibilty = function () {
        if ( settings.visible_audio_players ) {
            this.sound.style = "dislpay: full"
        } else {
            this.sound.style = "display: none"
        }
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
    this.updateVolume = function (volume) {
        this.sound.volume =
            // ensure that the volume never goes above 1, or below 0
            Math.max(0,
                Math.min(1,
                    // number between 1 and 0, specific for this audio category
                    settings.volume_mixer[this.category]
                    // the master volume, if this is at 0.5, it will halve the sound of all audio players
                    * settings.volume_mixer["master"]
                    * volume
                )
            )
    }

    // create the HTML audio player
    this.sound = document.createElement("audio")
    this.sound.src = src
    this.sound.setAttribute("preload", "auto")
    this.sound.setAttribute("controls", "none")

    // hide the audo players according to the settings
    this.updateVisibilty()

    // get the "misc" div, and add the html audio player to it
    document.getElementById("misc").appendChild(this.sound)

    // audio mixer
    this.updateVolume(1)

    console.log(`[ASSETS] [${this.category.toUpperCase()}] ${key} is done loading`)
}

// GIF
// to generate a clone of this GIF, in order to draw multiple gifs at one, you would do something like this
// const coiny = global.assets["sprite_space_coin"].newClone()
// coiny.setPosition(randFloat(100, 1720), randFloat(100, 800))
// coiny.setTicksPerFrame(randInt(2, 20))
// coiny.draw()
export class GIF {
    constructor(urls, ctx, onload, frames, scale) {
        this.urls = urls
        this.ctx = ctx

        this.current_frame = 0
        this.ticks_per_frame = 10

        if ( scale == undefined ) {
            this.scale = 1
        } else {
            this.scale = scale
        }

        // game stuff
        this.position = {
            "x": null,
            "y": null
        }

        if (frames == undefined) {
            this.frames = []
            const frames_ready = []

            // load all the sub images
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i]
                this.frames.push(new Image())
                this.frames[i].onload = function () {
                    // set this frame's status to loaded
                    frames_ready[i] = true
                    // check if all the frames are loaded
                    if ( !frames_ready.includes(false) ) {
                        // call the callback function
                        if (typeof onload === 'function') {
                            onload() // Execute the onload callback if defined
                        } else {
                            alert(`onload function not assigned for gif with urls ${urls}`)
                        }
                    }
                }
                frames_ready.push(false)
                this.frames[i].src = url
            }
        } else {
            this.frames = frames
        }
    }

    setPosition(x, y) {
        this.position.x = x
        this.position.y = y
    }

    setTicksPerFrame(n) {
        Math.max(1, this.ticks_per_frame = n)
    }

    setScale(scale) {
        this.scale = scale
    }

    newClone() {
        // return a copy of this
        return new GIF(this.urls, this.ctx, null, this.frames, this.scale)
    }

    draw() {
        if ( this.position.x == null || this.position.y == null) {
            alert(`my position is null :( ${this}`)
        }
        this.current_frame = Math.floor(global.frames_processed/this.ticks_per_frame) % this.frames.length
        
        const this_frame = this.frames[this.current_frame]

        if ( this.scale != 1 ) {
            // scale the sprite to have a new scale
            this.ctx.setTransform(
                /*     scale x */ this.scale,
                /*      skew x */ 0,
                /*      skew y */ 0,
                /*     scale y */ this.scale,
                /* translate x */ (this.position.x - (this_frame.width/2) * this.scale),
                /* translate y */ (this.position.y - (this_frame.height/2) * this.scale),
            )
        
            // this.sprite.draw()
            this.ctx.drawImage(this_frame, 0, 0)
            this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        } else {
            this.ctx.drawImage(this_frame, this.position.x - this_frame.width/2, this.position.y - this_frame.height/2)
        }
    }
}






// customImage
export class customImage {
    constructor(url, ctx, post_load, scale) {
        this.url = url
        this.ctx = ctx

        this.current_frame = 0
        this.ticks_per_frame = 10

        if ( scale == undefined ) {
            this.scale = 1
        } else {
            this.scale = scale
        }

        this.position = {
            x: null,
            y: null
        }

        this.size = {
            x: 64,
            y: 64
        }

        this.img = new Image();
        this.img.src = url
        this.img.onload = function() {
            if (typeof post_load === 'function') {
                post_load() // Execute the onload callback if defined
            } else if (post_load != "disabled") {
                alert(`onload function not assigned for customImage ${url}`)
            }
        }
    }

    setPosition(x, y) {
        this.position.x = x
        this.position.y = y
    }

    setSize(x, y) {
        this.size.x = x
        this.size.y = y
    }

    setScale(scale) {
        this.scale = scale
    }

    newClone() {
        // return a copy of this
        return new customImage(this.url, this.ctx, "disabled", this.scale)
    }

    draw() {
        if ( this.position.x == null || this.position.y == null) {
            alert(`my position is null :( ${this}`)
        }

        this.ctx.drawImage(
            this.img,
            this.position.x, this.position.y,
            this.size.x, this.size.y);
    }
}













// function to make sure all the needed assets are loaded before we try to use them
export async function loadAssets(assetSources, ctx) {
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
