
/*

This main script is the browser entry point.

*/

///<reference path="../deps/babylon/babylon.d.ts"/>

import Nanoshooter from 'Nanoshooter/Nanoshooter'

// Let's keep track of how long initialization takes.
const timeBeforeInitialize = (+new Date)

// Initialize the Nanoshooter game.
const nanoshooter = window['nanoshooter'] = new Nanoshooter({
  hostElement: <HTMLElement>document.querySelector('.game')
})

// Update the framerate display.
const fpsElement = <HTMLElement>document.querySelector('.fps')
setInterval(() => {
  fpsElement.textContent = nanoshooter.getFrameRate().toFixed(0)
}, 100)

// Start running the game engine.
nanoshooter.start()

// Log the profiling results.
const timeAfterInitialize = (+new Date)
const loadTime = (timeBeforeInitialize - performance.timing.navigationStart).toFixed(0)
const initializeTime = (timeAfterInitialize - timeBeforeInitialize).toFixed(0)
nanoshooter.logger.log(`(→) Page load ${loadTime} ms / Game initialization ${initializeTime} ms`)
