
import Stateful from "./Stateful";
import Ticker, {TickInfo} from "./Ticker";
import Entity from "./Entity";

export default class Game extends Stateful {
    log: Logger;
    state: GameState;
    logicTicker: Ticker;

    canvas: HTMLCanvasElement;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;

    totalTicks: number = 0;
    totalFrames: number = 0;

    constructor(options: GameOptions) {
        super();
        const startTime = (+new Date);

        this.log = options.log;

        this.state = {
            entities: {}
        };

        this.canvas = document.createElement("canvas");
        options.host.appendChild(this.canvas);

        this.engine = new BABYLON.Engine(this.canvas, true); // Canvas must already be attached to the document.
        this.scene = new BABYLON.Scene(this.engine);

        window.addEventListener("resize", () => this.engine.resize());

        // We establish our own ticker for logic, but not for rendering (Babylon handles its own render loop).
        this.logicTicker = new Ticker(tickInfo => this.logic(tickInfo));

        const endTime = (+new Date);
        const loadingTime = (startTime - performance.timing.navigationStart).toFixed(0);
        const gameInitTime = (endTime - startTime).toFixed(0);
        const totalStartupTime = (endTime - performance.timing.navigationStart).toFixed(0);
        this.log(`Total startup ${totalStartupTime} ms – Page loading ${loadingTime} ms – Game initialization ${gameInitTime} ms`);
    }

    /**
     * Game logic loop.
     * All game logic occurs here.
     */
    logic(tickInfo: TickInfo) {
        ++this.totalTicks;
    }

    /**
     * Rendering loop.
     * All rendering activities happen here.
     */
    render(renderInfo: TickInfo): void {
        this.scene.render();
        ++this.totalFrames;
    }

    /**
     * Run the game engine (rendering and logic loops).
     */
    start() {
        this.logicTicker.start();
        this.engine.runRenderLoop(() => {
            const since = performance.now() - this.lastRenderTime;
            this.render({since});
            this.lastRenderTime = performance.now();
        });
    }
    private lastRenderTime = performance.now();

    /**
     * Halt the game engine (rendering and logic loops).
     */
    stop(): Promise<void> {
        this.engine.stopRenderLoop();
        return this.logicTicker.stop();
    }

    /** Entity ID pulling station. */
    pullId = () => (++this.nextId).toString();
    nextId = 0;

    /**
     * Attach an entity to the game.
     */
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
