import { handleNumber } from "../hud.js"
import { play_game } from "../index.js"

const main_menu_element = document.getElementById("main-menu")
const about_menu_element = document.getElementById("about-menu")
const game_over_screen_element = document.getElementById("game-over-screen")

let current_menu = main_menu_element

export async function loadMenu() {
    console.log("initializing menu...")

    main_menu_element.hidden = false

    document.getElementById("about-btn").onclick = aboutButtonClick

    document.querySelectorAll('[data-button="play-btn"]').forEach((element) => {
        element.onclick = playButtonClick
    })

    document.querySelectorAll('[data-button="return-to-main-menu-btn"]').forEach((element) => {
        element.onclick = backButtonClick
    })

    
    // delete the loading bar
    console.log("deleting loading bar...")
    document.getElementById("loading-bar").remove()
}

export function playButtonClick () {
    current_menu.hidden = true
    console.log("clicked on the play button on the main-menu.")
    play_game()
}

function aboutButtonClick () {
    current_menu.hidden = true
    current_menu = about_menu_element
    about_menu_element.hidden = false
    console.log("clicked on the about button on the main-menu.")
}

function backButtonClick () {
    current_menu.hidden = true
    current_menu = main_menu_element
    main_menu_element.hidden = false
    console.log("clicked on the back button, returning to the main-menu.")
}

export function showGameOverScreen(score) {
    current_menu.hidden = true
    current_menu = game_over_screen_element
    game_over_screen_element.hidden = false
    document.getElementById("score-display").textContent = `You got a score of ${handleNumber(score)}`
    console.log("displaying the game over screen.")
}