
///<reference path="../bower_components/babylonjs/dist/preview release/babylon.d.ts"/>
///<reference path="../typings/browser.d.ts"/>

import Nanoshooter from "./Nanoshooter"

// This main script is the entry point for the web browser.
//   - Instantiate and start the Nanoshooter game.
//   - Log some timing/profiling information.
//   - Start running the game.

const timeBeforeInitialize = (+new Date)

// Initialize the Nanoshooter game.
const nanoshooter = window["nanoshooter"] = new Nanoshooter({
    log: (...messages: any[]) => console.log.apply(console, messages),
    hostElement: <HTMLElement>document.querySelector(".game")
})

{ // Establish a framerate display.
    const fps = <HTMLElement>document.querySelector(".fps")
    setInterval(() => {
        fps.textContent = nanoshooter.getFramerate().toFixed(0)
    }, 100)
}

// Start running the game engine.
nanoshooter.start()

// Log the profiling results.
const timeAfterInitialize = (+new Date)
const loadTime = (timeBeforeInitialize - performance.timing.navigationStart).toFixed(0)
const initializeTime = (timeAfterInitialize - timeBeforeInitialize).toFixed(0)
console.debug(`(→) Page load ${loadTime} ms / Game initialization ${initializeTime} ms`)
