import { handleNumber } from "../hud.js"
import { play_game } from "../index.js"
import { resetSettings, settings_menu } from "./settings_menu.js"
import { updateShopMenu } from "./shop.js"

const main_menu_element = document.getElementById("main-menu")
const settings_menu_element = document.getElementById("settings-menu")
const about_menu_element = document.getElementById("about-menu")
const store_menu_element = document.getElementById("store-menu")
const game_over_screen_element = document.getElementById("game-over-screen")

let current_menu = main_menu_element

export async function loadMenu() {
    console.log("initializing menu...")

    main_menu_element.hidden = false

    document.getElementById("settings-btn").onclick = settingsButtonClick
    document.getElementById("about-btn").onclick = aboutButtonClick

    document.querySelectorAll('[data-button="play-btn"]').forEach((element) => {
        element.onclick = playButtonClick
    })

    document.querySelectorAll('[data-button="store-btn"]').forEach((element) => {
        element.onclick = storeButtonClick
    })

    document.querySelectorAll('[data-button="return-to-main-menu-btn"]').forEach((element) => {
        element.onclick = backButtonClick
    })

    document.querySelectorAll('[data-button="settings-reset-to-defaults"]').forEach((element) => {
        element.onclick = () => {
            console.log("reseting settings back to the default")
            resetSettings()
        }
    })
    
    
    // delete the loading bar
    console.log("deleting loading bar...")
    document.getElementById("loading-bar").remove()
}

function playButtonClick () {
    current_menu.hidden = true
    console.log("clicked on the play button on the main-menu.")
    play_game()
}

function settingsButtonClick () {
    current_menu.hidden = true
    current_menu = settings_menu_element
    settings_menu_element.hidden = false
    console.log("clicked on the settings button on the main-menu.")
}

function aboutButtonClick () {
    current_menu.hidden = true
    current_menu = about_menu_element
    about_menu_element.hidden = false
    console.log("clicked on the about button on the main-menu.")
}

function storeButtonClick() {
    current_menu.hidden = true
    current_menu = store_menu_element
    store_menu_element.hidden = false
    console.log("clicked on the store button on the main-menu.")
    updateShopMenu()
}

function backButtonClick () {
    current_menu.hidden = true
    current_menu = main_menu_element
    main_menu_element.hidden = false
    console.log("clicked on the back button, returning to the main-menu.")
}

export function showGameOverScreen(score, coins, time) {
    current_menu.hidden = true
    current_menu = game_over_screen_element
    game_over_screen_element.hidden = false
    document.getElementById("score-display").textContent = `You got a score of ${handleNumber(score)}`
    console.log("displaying the game over screen.")
}