
/**
 * Generic ticking loop, with start/stop controls.
 * Keeps a consistent timeline.
 */
export default class Ticker {

  /**
   * Instantiate a ticker with an action function which will be called repeatedly.
   */
  constructor({tick, relax = 10}: TickerOptions) {
    this.tick = tick
    this.relax = relax
  }

  /** Total ticker time, which actually pauses when the ticker is paused. */
  private timeline: number = 0

  /** Action to be called for every tick while the ticker is running. */
  private tick: TickAction

  /** Time to relax in between ticks. */
  private relax: number

  /** Nifty statistics. */
  private stats = {
    totalTicks: 0
  }

  // For starting and stopping.
  private stopTickingCallback: () => void
  private lastTickTime = performance.now()

  /**
   * Start the recursive ticking loop.
   */
  start() {

    // If the stop callback is set, call it, clear it, and stop the recursive ticking process by returning.
    if (this.stopTickingCallback) {
      this.stopTickingCallback()
      this.stopTickingCallback = null
      return
    }

    // Gather 'start' timings.
    let now = performance.now()
    const timeSinceLastTick = now - this.lastTickTime
    this.timeline += timeSinceLastTick
    const tickStartTime = now

    // Call the tick action.
    this.tick({
      timeSinceLastTick,
      timeline: this.timeline
    })

    // Gather 'after' timings.
    now = performance.now()
    this.lastTickTime = now
    const tickTime = now - tickStartTime

    ++this.stats.totalTicks

    // Recurse, but give the browser some time to relax.
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        this.start()
      })
    }, this.relax)
  }

  /**
   * Halt the ticker.
   */
  stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.stopTickingCallback = () => resolve()
    })
  }
}

/**
 * Options for instantiating a new ticker.
 */
export interface TickerOptions {
  tick: TickAction
  relax?: number
}

/**
 * Action to take when a tick occurs.
 * A function that is called repeatedly, for each tick.
 */
export type TickAction = (tickReport: TickReport) => void

/**
 * Package of information that is passed along with each tick action.
 */
export interface TickReport {

  /** Total place along ticker's timeline, which effectively freezes on stop() and resumes on start(). */
  timeline: number

  /** Duration of time that has passed since the end of the last tick to the beginning of this tick, in milliseconds. */
  timeSinceLastTick: number
}
