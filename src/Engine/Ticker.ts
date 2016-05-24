
/**
 * Utility dedicated to stop/start controls for ticking loops, like game logic or physics.
 */
export default class Ticker {

    /** Action to be called for every tick while the ticker is running. */
    action: TickAction;

    /**
     * Create a ticker with an action function which will be called repeatedly.
     */
    constructor(action: TickAction) {
        this.action = action;
    }

    /**
     * Halt the ticker.
     */
    stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.stopTickingCallback = () => resolve();
        });
    }
    stopTickingCallback: () => void;

    /**
     * Start the recursive tick loop.
     */
    tick() {
        if (this.stopTickingCallback) return this.stopTickingCallback();
        const since = performance.now() - this.lastTickTime;

        this.action({since});

        this.lastTickTime = performance.now();
        window.requestAnimationFrame(() => {
            this.tick();
        });
    }
    lastTickTime = performance.now();

    /** Alias to start ticking. */
    start() { this.tick(); }
}

export type TickAction = (tickInfo: TickInfo) => void;

export interface TickInfo {

    /** Time since the last tick, in milliseconds. */
    since: number;
}
