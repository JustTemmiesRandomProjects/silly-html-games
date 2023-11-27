import { getCookie, setCookie } from "../cookies.js"
import { settings } from "../tems_library/settings.js"

class SettingsMenu {
    constructor () {
        loadSettings()
        
        const buttons = {
            "show_hitboxes": document.getElementById("settings-show-hitboxes-btn"),
            "visible_audio_players": document.getElementById("settings-view-audio-players-btn"),
            "circles_collide": document.getElementById("settings-circles-collide-btn"),
            "player_invincible": document.getElementById("settings-player-invincible-btn"),
            "player_collide": document.getElementById("settings-player-collision-btn"),
            "debug_test_1": document.getElementById("settings-debug-test-1-btn"),
            "debug_test_2": document.getElementById("settings-debug-test-2-btn"),
        }

        const volume_sliders = {
            "master": document.getElementById("master-volume-slider"),
            "sfx": document.getElementById("sfx-volume-slider"),
            "music": document.getElementById("music-volume-slider"),
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
                saveSettings()
                if (settings[key] == true) {
                    value.className = "button-active"
                } else {
                    value.className = "button-inactive"
                }
            })
        }

        for (const [key, value] of Object.entries(volume_sliders)) {
            if ( settings.volume_mixer[key] == undefined) {
                console.log(`${key} not defined in settings`)
                alert(`${key} not defined in settings`)
            }

            value.value = settings.volume_mixer[key] * 100

            value.addEventListener("input", () => {
                settings.volume_mixer[key] = parseInt(value.value) / 100
                saveSettings()
            })
        }
    }
}

function saveSettings() {
    const settings_data = getDefaultSettings()

    setCookie("settings_data", settings_data)
}

function loadSettings() {
    const settings_data = getCookie("settings_data")


    for (const [key, value] of Object.entries(getDefaultSettings())) {
        console.log(key, value)
    }

    settings.show_hitboxes = settings_data["show_hitboxes"]
    settings.visible_audio_players = settings_data["visible_audio_players"]
    settings.circles_collide = settings_data["circles_collide"]
    settings.player_invincible = settings_data["player_invincible"]
    settings.player_collide = settings_data["player_collide"]
    settings.debug_test_1 = settings_data["debug_test_1"]
    settings.debug_test_2 = settings_data["debug_test_2"]

    settings.volume_mixer["master"] = settings_data["master"]
    settings.volume_mixer["sfx"] = settings_data["sfx"]
    settings.volume_mixer["music"] = settings_data["music"]
}

function getDefaultSettings() {
    return {
        "show_hitboxes": settings.show_hitboxes,
        "visible_audio_players": settings.visible_audio_players,
        "circles_collide": settings.circles_collide,
        "player_invincible": settings.player_invincible,
        "player_collide": settings.player_collide,
        "debug_test_1": settings.debug_test_1,
        "debug_test_2": settings.debug_test_2,
    
        "master": settings.volume_mixer["master"],
        "sfx": settings.volume_mixer["sfx"],
        "music": settings.volume_mixer["music"],    
    }
}

const settings_menu = new SettingsMenu()

export { settings_menu }