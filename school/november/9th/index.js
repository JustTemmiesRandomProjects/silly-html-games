import { rand_float, rand_int } from "./tems_library.js";

const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const circleRadiusRand = 30
const circleRadiusOffset = 5

const circles = []

const colours = [
    "#800080BF",
    "#FFD500BF",
    "#FF971CBF",
    "#0341AEBF",
    "#f00000BF",
    "#72CB3BBF",
    "#00f0f0BF"
]

class Circle {
    constructor(x, y, radius) {
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = colours[rand_int(0, colours.length)]
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI)
        ctx.fillStyle = this.colour
        ctx.fill()
    }
}


function init() {
    for (let i = 0; i < 1000; i ++) {
        const radius = rand_int(0, circleRadiusRand) + circleRadiusOffset
        circles.push(
            new Circle(
                rand_int(radius, canvas.width - 2*radius),
                rand_int(radius, canvas.height - 2*radius),
                radius
            )
        )
        
        circles[i].draw()
    }
}

init()