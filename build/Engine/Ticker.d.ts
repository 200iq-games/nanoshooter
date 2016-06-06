/**
 * Stop/start controls for generic ticking loops.
 */
export default class Ticker {
    /**
     * Create a ticker with an action function which will be called repeatedly.
     */
    constructor({tick, relax}: TickerOptions);
    /** Total ticker time, which actually pauses when the ticker is paused. */
    private timeline;
    /** Action to be called for every tick while the ticker is running. */
    private tick;
    /** Time to relax in between ticks. */
    private relax;
    /** Nifty statistics. */
    private stats;
    private stopTickingCallback;
    private lastTickTime;
    /**
     * Start the recursive ticking loop.
     */
    start(): void;
    /**
     * Halt the ticker.
     */
    stop(): Promise<void>;
}
export interface TickerOptions {
    tick: TickAction;
    relax?: number;
}
export declare type TickAction = (tickInfo: TickInfo) => void;
/**
 * Package of information that is passed along to the TickAction for each tick.
 */
export interface TickInfo {
    /** Total place along ticker's timeline, which effectively freezes on stop() and resumes on start(). */
    timeline: number;
    /** Duration of time that has passed since the end of the last tick to the beginning of this tick, in milliseconds. */
    timeSince: number;
}
