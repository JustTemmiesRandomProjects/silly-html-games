class SettingsMenu {
    constructor () {
        const buttons = {
            "visible_audio_players": document.getElementById("settings-view-hitboxes-btn")
        }

        console.log(buttons[0])
    }
}

const settings_menu = new SettingsMenu()

export { settings_menu }