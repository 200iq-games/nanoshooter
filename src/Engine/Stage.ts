
import {TickInfo} from "./Ticker"

/**
 * Governs the Babylon scene from a high level.
 */
export default class Stage {

    /**
     * Create a blank game world in Babylon.
     */
    constructor(options: StageOptions) {
        // Initializing a blank Babylon scene.
        this.canvas = document.createElement("canvas")
        options.hostElement.appendChild(this.canvas)
        this.engine = new BABYLON.Engine(this.canvas, true)
        this.scene = new BABYLON.Scene(this.engine)
        window.addEventListener("resize", () => this.engine.resize())
    }

    canvas: HTMLCanvasElement
    engine: BABYLON.Engine
    scene: BABYLON.Scene

    /** Nifty debug info. */
    stats = {
        totalFrames: 0
    }

    /**
     * Start the rendering loop.
     */
    start() {
        this.engine.runRenderLoop(() => {
            const since = performance.now() - this.lastRenderTime
            this.render({since})
            this.lastRenderTime = performance.now()
        })
    }
    private lastRenderTime = performance.now()

    /**
     * Stop the rendering loop.
     */
    stop() {
        this.engine.stopRenderLoop()
    }

    /**
     * Render a frame.
     */
    private render({since}: RenderInfo) {
        this.scene.render()
        ++this.stats.totalFrames
    }
}

export interface StageOptions {

    /** HTML element to inject the canvas within. */
    hostElement: HTMLElement
}

export interface RenderInfo {

    /** Time since the last frame finished rendering. */
    since: number
}