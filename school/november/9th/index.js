import { rand_float, rand_int } from "./tems_library.js";

const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const circleRadiusRand = 30
const circleRadiusOffset = 5
const circleCount = 100

const circles = []

const colours = [
    "#800080",
    "#FFD500",
    "#FF971C",
    "#0341AE",
    "#f00000",
    "#72CB3B",
    "#00f0f0"
]

class Circle {
    constructor(x, y, radius, angleOffset, angleMultiplier, speed) {
        const randomAngle = Math.random() * angleMultiplier + angleOffset;

        this.x = x
        this.y = y
        this.radius = radius
        this.colour = colours[rand_int(0, colours.length)]


        this.dx = Math.cos(randomAngle) * speed
        this.dy = Math.sin(randomAngle) * speed
    }

    draw_at_pos(x, y) {
        ctx.beginPath()
        ctx.arc(x, y, this.radius, 0, 2*Math.PI)
        ctx.fillStyle = this.colour
        ctx.fill()
    }

    draw() {
        // handle the edges on the x plane
        if (this.x < this.radius) {
            this.draw_at_pos(this.x + canvas.width, this.y)
        } else if (this.x > canvas.width - this.radius) {
            this.draw_at_pos(this.x - canvas.width, this.y)
        } 

        // handle the edges on the y plane
        if (this.y < this.radius) {
            this.draw_at_pos(this.x, this.y + canvas.height)
        } else if (this.y > canvas.height - this.radius) {
            this.draw_at_pos(this.x, this.y - canvas.height)
        }
        
        // draw the circle at the actual position
        this.draw_at_pos(this.x, this.y)
    }

    // direction is an array
    move_towards_direction(direction) {
        this.x += direction[0]
        this.y += direction[1]
        if (this.x < 0 ) {
            this.x += canvas.width
        } else if (this.x > canvas.width ) {
            this.x -= canvas.width
        }

        if (this.y < 0) {
            this.y += canvas.height
        } else if (this.y > canvas.height) {
            this.y -= canvas.height
        }
    }

    move() {
        this.move_towards_direction([this.dx, this.dy])
    }
}


function init() {
    for (let i = 0; i < circleCount; i ++) {
        const radius = rand_int(0, circleRadiusRand) + circleRadiusOffset
        circles.push(
            new Circle(
                rand_int(radius, canvas.width - 2*radius),
                rand_int(radius, canvas.height - 2*radius),
                radius,
                0,
                Math.PI * 2,
                rand_float(1, 5)
            )
        )
    }
}

function draw_circles() {
    canvas.clear
    for (let i = 0; i < circles.length; i ++) {
        circles[i].draw()
    }
}

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw_circles()
    circles.forEach((circle) => {
            circle.move()
        }
    )
}

init()
animate()