
export default class Ticker {
    action: TickAction;

    constructor(action: TickAction) {
        this.action = action;
    }

    stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.stopTickingCallback = () => resolve();
        });
    }
    stopTickingCallback: () => void;

    tick(): void {
        if (this.stopTickingCallback) return this.stopTickingCallback();
        const since = performance.now() - this.lastTickTime;

        this.action({since});

        this.lastTickTime = performance.now();
        window.requestAnimationFrame(() => {
            this.tick();
        });
    }
    lastTickTime = performance.now();

    start() { this.tick(); }
}

export type TickAction = (tickInfo: TickInfo) => void;

export interface TickInfo {

    /** Time since the last tick, in milliseconds. */
    since: number;
}
