
export default class Ticker {
    action: TickAction;

    constructor(action: TickAction) {
        this.action = action;
    }

    stopTicking: () => void;
    stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.stopTicking = () => resolve();
        });
    }

    lastTickTime = performance.now();
    tick(): void {
        if (this.stopTicking) return this.stopTicking();
        const since = performance.now() - this.lastTickTime;

        this.action({since});

        this.lastTickTime = performance.now();
        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

    start() { this.tick(); }
}

export type TickAction = (tickInfo: TickInfo) => void;

export interface TickInfo {

    /** Time since the last tick, in milliseconds. */
    since: number;
}
