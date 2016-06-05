
/**
 * Stop/start controls for generic ticking loops.
 */
export default class Ticker {

    /**
     * Create a ticker with an action function which will be called repeatedly.
     */
    constructor({tick, relax = 16}: TickerOptions) {
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

        // If stopTickingCallback is set, call it, clear it, and stop the recursive ticking process by returning.
        if (this.stopTickingCallback) {
            this.stopTickingCallback()
            this.stopTickingCallback = null
            return
        }

        // Gather 'start' timings.
        let now = performance.now()
        const timeSince = now - this.lastTickTime
        this.timeline += timeSince
        const tickStartTime = now

        // Call the TickAction.
        this.tick({
            timeSince,
            timeline: this.timeline
        })

        // Gather 'after' timings.
        now = performance.now()
        this.lastTickTime = now
        const tickTime = now - tickStartTime

        ++this.stats.totalTicks

        // Recurse, but give the browser some time to relax.
        setTimeout(()=>{
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

export interface TickerOptions {
    tick: TickAction
    relax?: number
}

export type TickAction = (tickInfo: TickInfo) => void

/**
 * Package of information that is passed along to the TickAction for each tick.
 */
export interface TickInfo {

    /** Total place along ticker's timeline, which effectively freezes on stop() and resumes on start(). */
    timeline: number

    /** Duration of time that has passed since the end of the last tick to the beginning of this tick, in milliseconds. */
    timeSince: number
}
