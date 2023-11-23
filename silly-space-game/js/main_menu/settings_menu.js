import { settings } from "../tems_library/settings.js";

class SettingsMenu {
    constructor () {
        const buttons = {
            "show_hitboxes": document.getElementById("settings-show-hitboxes-btn"),
            "visible_audio_players": document.getElementById("settings-view-audio-players-btn"),
            "circles_collide": document.getElementById("settings-circles-collide-btn"),
            "player_collide": document.getElementById("settings-player-collide-btn"),
        }

        for (const [key, value] of Object.entries(buttons)) {
            if ( settings[key] == undefined ) {
                console.log(`${key} not defined in settings`)
                alert(`${key} not defined in settings`)
            }

            // initiate the button's colour
            if ( settings[key] == true ) {
                value.className = "button-active"
            } else {
                value.className = "button-inactive"
            }

            // register a function to trigger on button click
            value.addEventListener("click", () => {
                settings[key] = !settings[key]
                if (settings[key] == true) {
                    value.className = "button-active"
                } else {
                    value.className = "button-inactive"
                }
            })
        }
    }
}

const settings_menu = new SettingsMenu()

export { settings_menu }