import { settings } from "./settings.js"

// InputManager constructor function
export function InputManager(canvas) {
    this.canvas = canvas
    this.keys = {}
    this.mouse = {
        x: 0,
        y: 0,
        leftButton: false,
        rightButton: false,
    }
    this.controllers = []

    this.isUsingController = false


    // set up event listeners
    this.setupListeners()
}

 
// initialize event listeners
InputManager.prototype.setupListeners = function () {
    // keyboard events
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
    window.addEventListener('keyup', this.handleKeyUp.bind(this))

    // mouse events
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))

    // controller events
    window.addEventListener('gamepadconnected', this.handleControllerConnected.bind(this))
    window.addEventListener('gamepaddisconnected', this.handleControllerDisconnected.bind(this))
}


// handle controller connected
InputManager.prototype.handleControllerConnected = function (event) {
    // check for browser compatability, granted this event might not be fired in the first place
    if ( navigator.userAgent.indexOf("Firefox") != -1 ) {console.log("Firefox browser detected")}
    else if ( window.chrome ) {console.log("Chromium browser detected")}
    else { alert("sorry, controller don't seem to be officially supported for your browser, you might encounter issues with them") }

    this.controllers.push(event.gamepad)
    const index = this.controllers.indexOf(event.gamepad)

    console.log(`controller ${index} connected`)
}

// handle controller disconnected
InputManager.prototype.handleControllerDisconnected = function (event) {
    const index = this.controllers.indexOf(event.gamepad)
    if (index !== -1) {
        this.controllers.splice(index, 1)
    }

    console.log(`controller ${index} disconnected`)
}

// keyboard event handlers
InputManager.prototype.handleKeyDown = function (event) {
    this.keys[event.code] = true
}

InputManager.prototype.handleKeyUp = function (event) {
    this.keys[event.code] = false
}

// mouse event handlers
InputManager.prototype.handleMouseMove = function (event) {
    this.isUsingController = false
    var rect = this.canvas.getBoundingClientRect()
    this.mouse.x = event.clientX - rect.left
    this.mouse.y = event.clientY - rect.top
}

InputManager.prototype.handleMouseDown = function (event) {
    if (event.button === 0) {
        this.mouse.leftButton = true
    } else if (event.button === 2) {
        this.mouse.rightButton = true
    }
}

InputManager.prototype.handleMouseUp = function (event) {
    if (event.button === 0) {
        this.mouse.leftButton = false
    } else if (event.button === 2) {
        this.mouse.rightButton = false
    }
}

// get controller axes 
InputManager.prototype.getAxes = function (controller, axes) {
    if ( Math.abs(controller.axes[axes]) > settings.controller_dead_zone ) {
        return controller.axes[axes]
    } else {
        return 0
    }
}

// get controller button
InputManager.prototype.getButton = function (controller, button) {
    return controller.buttons[button].pressed
}

// get keyboard key
InputManager.prototype.getKey = function (key) {
    return this.keys[key] ? 1 : 0;
}

InputManager.prototype.capInput = function (inputValue, min, max) {
    return Math.max(min, Math.min(max, inputValue))
}

// normalize function, this normalizes player input
// so that the player doesn't move faster diagonally
InputManager.prototype.normalize = function (x, y) {
    // calculate the distance
    const distance = Math.sqrt(x * x + y * y);

    // if the total is above 1, normalize the values
    if (distance > 1) {
        x /= distance;
        y /= distance;
    }
    
    return { x, y }
}