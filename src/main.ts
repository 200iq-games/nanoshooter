
///<reference path="../bower_components/babylonjs/dist/babylon.2.3.d.ts"/>
///<reference path="../typings/browser.d.ts"/>

import Nanoshooter from "./Nanoshooter"

const timeBeforeInitialize = (+new Date)

const nanoshooter = window["nanoshooter"] = new Nanoshooter({
    log: (...messages: any[]) => console.log.apply(console, messages),
    hostElement: document.body
})

const timeAfterInitialize = (+new Date)
const loadTime = (timeBeforeInitialize - performance.timing.navigationStart).toFixed(0)
const initializeTime = (timeAfterInitialize - timeBeforeInitialize).toFixed(0)
console.debug(`→ Page load ${loadTime} ms / Game initialization ${initializeTime} ms`)
