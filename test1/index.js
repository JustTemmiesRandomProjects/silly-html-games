const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

let score = 0
let lastGameTick = Date.now()

// ball
const ballRadius = 14

let x = canvas.width / 2
let y = canvas.height - 80

let dx = 5
let dy = -5

//pieces
const pieceColours = {
    "0": "#272727",
    "T": "#800080",
    "O": "#FFD500",
    "L": "#FF971C",
    "J": "#0341AE",
    "Z": "#f00000",
    "S": "#72CB3B",
    "I": "#00f0f0"
}

//board 
let boardWidth = 10
let boardHeight = 20
const board = []
const tempBoard = []

for (let x = 0; x < boardWidth; x++) {
    board.push([])
    tempBoard.push([])
    for (let y = 0; y < boardHeight; y++) {
        board[x][y] = pieceColours["0"]
        tempBoard[x][y] = false
    }
}



//tiles
size = 40
left_margin = (canvas.width / 2) - ((size * boardWidth) / 2)
top_margin = (canvas.height / 2) - ((size * boardHeight) / 2)



function draw_tile(x, y) {
    ctx.beginPath()
    ctx.rect(
        left_margin + size * x - 1,
        top_margin + size * y - 1,
        size + 2,
        size + 2
    )
    ctx.fillStyle = board[x][y]
    ctx.fill()
    ctx.closePath()
}

function draw_temp_tile(x, y) {
    if (tempBoard[x][y] === true) {
        ctx.beginPath()
        ctx.rect(
            left_margin + size * x - 1,
            top_margin + size * y - 1,
            size + 2,
            size + 2
        )
        ctx.fillStyle = "#ffffff"
        ctx.fill()
        ctx.closePath()
    }
}

function draw_tiles() {
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            draw_tile(x, y)
        }
    }
}

function move_piece() {
    if (Date.now() - lastGameTick < 1000) { return }
    console.log("tick!")

    lastGameTick = Date.now()
    for (let x = boardWidth - 1; x >= 0; x++) {
        for (let y = boardHeight - 1; y >= 0; y++) {
            if (tempBoard[x][y] === true) {
                tempBoard[x][y] = false
                tempBoard[x][y-1] = true
            }
        }
    }
}

function gameTick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw_tiles()
    move_piece()
    // drawBall()
    // drawPaddle()
    // drawBricks()
    // collisionDetection()
    // drawScore()
    // drawLives()
    // x += dx
    // y += dy

    requestAnimationFrame(gameTick)
}



// helper functions
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false
    }
}

document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)

gameTick()