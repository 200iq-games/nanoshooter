
///<reference path="../bower_components/babylonjs/dist/preview release/babylon.d.ts"/>
///<reference path="../typings/browser.d.ts"/>

import Nanoshooter from "./Nanoshooter"

// This script instantiates the Nanoshooter game and profiles the timing of that.

const timeBeforeInitialize = (+new Date)

const nanoshooter = window["nanoshooter"] = new Nanoshooter({
    log: (...messages: any[]) => console.log.apply(console, messages),
    hostElement: <HTMLElement>document.querySelector(".game")
})

{ // Framerate counter.
    const fps = <HTMLElement>document.querySelector(".fps")
    setInterval(() => {
        fps.textContent = nanoshooter.engine.getFps().toFixed(0);
    }, 100)
}

nanoshooter.start()

const timeAfterInitialize = (+new Date)
const loadTime = (timeBeforeInitialize - performance.timing.navigationStart).toFixed(0)
const initializeTime = (timeAfterInitialize - timeBeforeInitialize).toFixed(0)
console.debug(`→ Page load ${loadTime} ms / Game initialization ${initializeTime} ms`)
