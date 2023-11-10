import { accountForDisplay, loadImages, resizeCanvas } from "./tems_library.js"

const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

class Global {
    constructor(imageObjects) {
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

        this.images = imageObjects
    }
}

var global = null

window.onload = async function() {
    console.log("loading images..")
    let imageObjects = await loadImages({
        "background": "../assets/sprites/ulukai/background.png"
    })
    console.log("completed loading images!")
    
    global = new Global(imageObjects)
    console.log("completed initiating global varibles!")
}

export { canvas, ctx, global }