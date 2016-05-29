
/**
 * Governs a 3D Babylon scene from a high level.
 */
export default class Stage {

    constructor(options: StageOptions) {
        this.hostElement = options.hostElement
    }

    hostElement: HTMLElement

    canvas: HTMLCanvasElement

    engine: BABYLON.Engine

    scene: BABYLON.Scene

    totalFrames = 0

    /**
     * Set the stage.
     * Create a blank game world in Babylon.
     */
    initialize() {
        this.canvas = document.createElement("canvas")
        this.hostElement.appendChild(this.canvas)
        this.engine = new BABYLON.Engine(this.canvas, true)
        this.scene = new BABYLON.Scene(this.engine)
        window.addEventListener("resize", () => this.engine.resize())
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
        ++this.totalFrames
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
