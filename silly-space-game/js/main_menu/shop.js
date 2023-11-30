import { getCookie, setCookie } from "../cookies.js"
import { global } from "../global.js"

const upgrades = {
    "more_paint_1": [false, 10],
    "more_ships_1": [false, 30],
    "more_ships_2": [false, 60],
    "more_coins_1": [false, 10],
}

var coins = 0

// add event listeners for all the buttons
for (const [key, value] of Object.entries(upgrades)) {
    document.getElementById(`shop_${key}`)
        .addEventListener("click", function click() {
            console.log(`clicked ${key}?`)
        })
}


export function updateShopMenu() {
    coins = global.save_data["coins"]

    document.getElementById("shop-coin-counter").textContent = `Coins: ${coins}`

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