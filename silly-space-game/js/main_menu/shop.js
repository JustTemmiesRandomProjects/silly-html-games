import { getCookie, setCookie } from "../cookies.js"
import { global } from "../global.js"
import { handleNumber } from "../hud.js"

const upgrades = {
    "more_paint_1": [false, 3],
    "more_ships_1": [false, 10],
    "more_ships_2": [false, 25 ],
    "more_coins_1": [false, 10],
    "clone_first_5_coins": [false, 5],
    "clone_every_5_coins": [false, 15],
    "clone_every_1_coins": [false, 25],
    "clone_score": [false, 40],
    "clone_start": [false, 40],
}

var coins = 0
loadUpgrades()

// add event listeners for all the buttons
for (const [key, value] of Object.entries(upgrades)) {  
    const element = document.getElementById(`shop_${key}`)
    if ( element == undefined ) {
        alert(`could not find element ${key}`)
        break
    }

    // if the player already owns the upgrade, make it greeeeeen
    if ( upgrades[key][0] == true ) {
        element.classList.add("item-owned")
    }

    element.addEventListener("click", function click() {
            console.log(`clicked on shop item ${key}`)
            if ( coins >= upgrades[key][1] && upgrades[key][0] != true ) {
                global.save_data["coins"] -= upgrades[key][1]
                upgrades[key][0] = true
                this.classList.add("item-owned")

                saveUpgrades()
                updateShopMenu()
            }
        })
}


export function updateShopMenu() {
    coins = global.save_data["coins"]

    document.getElementById("shop-coin-counter").textContent = `Coins: ${handleNumber(coins)}`

    for (const [key, value] of Object.entries(upgrades)) {
        const button = document.getElementById(`shop_${key}`)

        // set the price
        button.textContent = `Cost: ${value[1]}`

        // set the colour of the button based on if you can afford it
        if ( value[1] > coins ) { 
            button.classList.add("item-cannot-afford")  
        } else {
            button.classList.remove("item-cannot-afford")
        }
    }
}

export function hasUpgrade(key) {
    return upgrades[key][0]
}

function saveUpgrades() {
    setCookie("store_data", upgrades)
    // fuck it just write the save code again, why not - i don't care anymore lmao
    setCookie("save_data", global.save_data)
}

function loadUpgrades() {
    const cookie_data = getCookie("store_data")

    for (const [key] of Object.entries(cookie_data)) {
        upgrades[key] = cookie_data[key]
    }
}