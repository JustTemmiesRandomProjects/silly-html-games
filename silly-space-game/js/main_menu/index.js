import { play_game } from "../index.js"
import { settings_menu } from "./settings_menu.js"

const main_menu_element = document.getElementById("main-menu")
const settings_menu_element = document.getElementById("settings-menu")
const about_menu_element = document.getElementById("about-menu")

let current_menu = main_menu_element

export async function load_menu() {
    console.log("initializing menu...")

    main_menu_element.hidden = false

    document.getElementById("play-btn").onclick = play_button_click
    document.getElementById("settings-btn").onclick = settings_button_click
    document.getElementById("about-btn").onclick = about_button_click

    document.querySelectorAll('[data-button="return-to-main-menu-btn"]').forEach((element) => {
        element.onclick = back_button_click
    })
    
    
    // delete the loading bar
    console.log("deleting loading bar...")
    document.getElementById("loading-bar").remove()
}

function play_button_click () {
    console.log("clicked on the play button on the main-menu")
    play_game()
}

function settings_button_click () {
    current_menu.hidden = true
    current_menu = settings_menu_element
    settings_menu_element.hidden = false
    console.log("clicked on the settings button on the main-menu")
}

function about_button_click () {
    current_menu.hidden = true
    current_menu = about_menu_element
    about_menu_element.hidden = false
    console.log("clicked on the about button on the main-menu")
}


function back_button_click () {
    current_menu.hidden = true
    current_menu = main_menu_element
    main_menu_element.hidden = false
    console.log("clicked on the back button, returning to the main-menu")
}