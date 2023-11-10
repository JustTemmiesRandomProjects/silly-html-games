import { accountForDisplay } from "./tems_library.js"

const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

class Global {
    constructor() {
        // adjust everything depending on the screen's largest dimension, for a consistent experience accross displays
        this.circleRadiusRand = accountForDisplay(25)
        this.circleRadiusOffset = accountForDisplay(5)
        this.circleSpeedRand =  accountForDisplay(2)
        this.circleSpeedOffset = accountForDisplay(0.3)

        this.circleCount = 30

        this.circles = []

        this.colours = [
            "#800080",
            "#FFD500",
            "#FF971C",
            "#0341AE",
            "#f00000",
            "#72CB3B",
            "#00f0f0"
        ]
    }
}

const global = new Global()

export { canvas, ctx, global }