// file to modify settings, this is different from global.js because i'm resuing the tems_library folder for other games
class Settings {
    constructor() {
        this.visible_audio_players = false

        // volume mixer levels, 1 means 100% audio, 0 means 0%
        this.volume_mixer = {
            "master": 0.12,
            "music": 1,
            "sfx": 1,
        }

        this.show_hitboxes = true
    }
}

const settings = new Settings()

export { settings }