// file to modify settings, this is different from global.js because i'm resuing the tems_library folder for other games
class Settings {
    constructor() {
        // volume mixer levels, 1 means 100% audio, 0 means 0%
        this.volume_mixer = {
            "master": 1,
            "music": 1,
            "sfx": 1,
        }
        this.visible_audio_players = false

        this.show_hitboxes = true

        this.controller_dead_zone = 0.15
    }
}

const settings = new Settings()

export { settings }