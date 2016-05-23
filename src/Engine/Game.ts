
import Stateful from "./Stateful";
import Entity from "./Entity";

export default class Game extends Stateful {
    log: Logger;

    state: GameState;
    canvas: HTMLCanvasElement;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;

    constructor(options: GameOptions) {
        super();
        const { host, log } = options;
        const startTime = (+new Date);

        this.state = {
            entities: {}
        };

        this.canvas = document.createElement("canvas");
        host.appendChild(this.canvas);

        const engine = this.engine = new BABYLON.Engine(this.canvas, true); // Canvas must already be attached to the document.
        const scene = this.scene = new BABYLON.Scene(engine);

        window.addEventListener("resize", () => engine.resize());
        engine.runRenderLoop(() => scene.render());

        const endTime = (+new Date);
        const loadingTime = (startTime - performance.timing.navigationStart).toFixed(0);
        const gameInitTime = (endTime - startTime).toFixed(0);
        const totalStartupTime = (endTime - performance.timing.navigationStart).toFixed(0);
        log(`Total startup ${totalStartupTime}ms – Page loading ${loadingTime}ms – Game initialization ${gameInitTime}ms`);
    }

    stopTicking: () => void;
    stop(): Promise<void> {
        this.engine.stopRenderLoop();
        return new Promise<void>((resolve, reject) => {
            this.stopTicking = () => resolve();
        });
    }

    lastTickTime = (+new Date);
    tick(): void {
        if (this.stopTicking) return this.stopTicking();
        const since = (+new Date) - this.lastTickTime;
        this.tick();
    }

    lastRender = (+new Date);
    render(): void {
        const since = (+new Date) - this.lastRender;
        this.scene.render();
    }

    // Entities must be attached to the game after they are created.
    nextId = 0;
    pullId = () => (++this.nextId).toString();
    attach(...entities: Entity[]): void {
        for (const entity of entities) {
            const id = this.pullId();
            entity.attach(this, id);
            this.state.entities[id] = entity;
        }
    }
}

export interface GameOptions {
    host: HTMLElement;
    log: Logger;
}

export type Logger = (...messages: string[]) => void;

export interface GameState {
    entities: {
        [id: string]: Entity;
    };
}
