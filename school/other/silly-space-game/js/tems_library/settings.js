// file to modify settings, this is different from global.js because i'm resuing the tems_library folder for other games
class Settings {
    constructor() {
        this.visibleAudioPlayers = false

        // volume mixer levels, 1 means 100% audio, 0 means 0%
        this.volumeMixer = {
            "master": 0,
            "music": 1,
            "sfx": 1,
        }

        this.showHitboxes = true
    }
}

const settings = new Settings()

export { settings }