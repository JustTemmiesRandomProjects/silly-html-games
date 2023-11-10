import { accountForDisplay } from "./tems_library.js"

const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

class Global {
    constructor() {
        // adjust everything depending on the screen's largest dimension, for a consistent experience accross displays
        this.circle_radius_rand = accountForDisplay(20)
        this.circle_radius_offset = accountForDisplay(12)
        this.circle_speed_rand = accountForDisplay(2)
        this.circle_speed_offset = accountForDisplay(0.3)

        this.circle_count = 30

        this.circles = []

        this.colours = [
            "#800080EF",
            "#FFD500EF",
            "#FF971CEF",
            "#0341AEEF",
            "#F00000EF",
            "#72CB3BEF",
            "#00F0F0EF"
        ]
    }
}

const global = new Global()

export { canvas, ctx, global }