
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

    /** Action to be called for every tick while the ticker is running. */
    private tick: TickAction

    /** Time to relax in between ticks. */
    private relax: number

    /** Nifty statistics. */
    private stats = {
        totalTicks: 0
    }

    // For starting and stopping.
    stopTickingCallback: () => void
    lastTickTime = performance.now()

    /**
     * Start the recursive tick loop.
     */
    start() {

        // Stop the recursive ticking process by returning.
        if (this.stopTickingCallback) {
            this.stopTickingCallback = null
            this.stopTickingCallback()
            return
        }

        let now = performance.now()
        const since = now - this.lastTickTime
        const tickStartTime = now

        this.tick({since})

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

export interface TickInfo {

    /** Duration of time that has passed since the end of the last tick to the beginning of this tick, in milliseconds. */
    since: number
}
