
/**
 * Govern a 3D Babylon scene from a high level.
 */
export default class Stage {

  // Access to the Babylon scene is public for anyone with access to the stage.
  hostElement: HTMLElement
  canvas: HTMLCanvasElement
  engine: BABYLON.Engine
  scene: BABYLON.Scene

  pick: BABYLON.PickingInfo = new BABYLON.PickingInfo()

  /** Nifty diagnostics. */
  private stats = {
    totalFrames: 0
  }

  /** Event listeners that start and stop with the stage. */
  private listeners = {
    resize: () => {
      this.engine.resize()
    },
    mousemove: () => {
      this.pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY)
    }
  }

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
  }

  /**
   * Start the rendering loop.
   */
  start() {
    window.addEventListener("resize", this.listeners.resize)
    window.addEventListener("mousemove", this.listeners.mousemove)

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

    window.removeEventListener("resize", this.listeners.resize)
    window.removeEventListener("mousemove", this.listeners.mousemove)
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
