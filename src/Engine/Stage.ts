
/**
 * Govern a 3D Babylon scene from a high level.
 * The stage is an access point to some key Babylon API components.
 */
export default class Stage {

  /** HTML element which contains the game's rendering canvas. */
  hostElement: HTMLElement

  /** Canvas HTML element which the game renders to. */
  canvas: HTMLCanvasElement

  /** Babylon engine instance. */
  engine: BABYLON.Engine

  /** Babylon scene instance. */
  scene: BABYLON.Scene

  /** Information about where the user's mouse cursor is hovering in the 3D scene. Updated on mousemove by the stage. */
  pick: BABYLON.PickingInfo = new BABYLON.PickingInfo()

  /** Nifty diagnostics. */
  private stats = {
    totalFrames: 0
  }

  /** Event listeners that start and stop with the stage. */
  private listeners = {

    // Prompt the BabylonJS engine to resize.
    resize: () => {
      this.engine.resize()
    },

    // Update the picking info about the user's mouse cursor in the 3D scene.
    mousemove: () => {
      this.pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY)
    }
  }

  /**
   * Accept stage options and initialize the stage's babylon components.
   */
  constructor(options: StageOptions) {
    this.hostElement = options.hostElement
    this.canvas = document.createElement('canvas')
    this.hostElement.appendChild(this.canvas)
    this.engine = new BABYLON.Engine(this.canvas, true)
    this.scene = new BABYLON.Scene(this.engine)

    // Apparently this makes BabylonJS care about UV mapping ¯\_(ツ)_/¯
    ;(<any>BABYLON).OBJFileLoader.OPTIMIZE_WITH_UV = true;
  }

  /**
   * Start the rendering loop.
   */
  start() {
    window.addEventListener('resize', this.listeners.resize)
    window.addEventListener('mousemove', this.listeners.mousemove)

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

    window.removeEventListener('resize', this.listeners.resize)
    window.removeEventListener('mousemove', this.listeners.mousemove)
  }

  /**
   * Render a frame.
   */
  private render({since}: RenderInfo) {
    this.scene.render()
    this.stats.totalFrames++
  }
}

/**
 * Options for creating a new stage.
 */
export interface StageOptions {

  /** HTML element to inject the canvas within. */
  hostElement: HTMLElement
}

/**
 * Information passed for each rendered frame.
 */
export interface RenderInfo {

  /** Time since the last frame finished rendering. */
  since: number
}
