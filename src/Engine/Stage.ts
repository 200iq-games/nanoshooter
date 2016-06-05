
/**
 * Govern a 3D Babylon scene from a high level.
 */
export default class Stage {

    constructor(options: StageOptions) {
        this.hostElement = options.hostElement
        this.initialize()
    }

    /**
     * Create an empty Babylon scene.
     */
    initialize() {
        this.canvas = document.createElement("canvas")
        this.hostElement.appendChild(this.canvas)
        this.engine = new BABYLON.Engine(this.canvas, true)
        this.scene = new BABYLON.Scene(this.engine)
        window.addEventListener("resize", () => this.engine.resize())
    }

    hostElement: HTMLElement
    canvas: HTMLCanvasElement
    engine: BABYLON.Engine
    scene: BABYLON.Scene

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

    /** Nifty diagnostics. */
    private stats = {
        totalFrames: 0
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
