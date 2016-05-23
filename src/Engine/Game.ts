
import Stateful from "./Stateful";
import Director from "./Director";
import Ticker, {TickInfo} from "./Ticker";
import Entity from "./Entity";

/**
 * Networkable 3D web game infrastructure.
 * Establishes a robust serializble game state and network-ready game logic engine.
 * Employs the 'director' to bring the game state to life with Babylon.
 */
export default class Game extends Stateful {

    /** Serializable game state data. */
    state: GameState = {
        entities: {}
    };

    /** Logging utility. */
    log: Logger;

    /** Game logic loop utility. */
    logicTicker: Ticker;

    /** Nifty debug info. */
    diagnostics = {
        totalTicks: 0
    };

    /** Manages the Babylon game scene. */
    director: Director;

    /**
     * Initialize a game.
     *   - Create the director.
     *   - Establish the game logic loop ticker.
     *   - Log some nifty timing info.
     */
    constructor(options: GameOptions) {
        super();
        this.log = options.log;
        const startTime = (+new Date);

        // Create the director, which will represent this game as a BabylonJS scene.
        this.director = new Director({
            game: this,
            hostElement: options.hostElement
        });

        // We establish our own ticker for game logic (the babylon rendering loop is managed by the director).
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
     * We'll probably want to poke the director from here a lot.
     */
    logic(tickInfo: TickInfo) {
        ++this.diagnostics.totalTicks;
    }
    
    /**
     * Run the whole game engine (start the logic ticker, prompt the director to start rendering).
     */
    start() {
        this.logicTicker.start();
        this.director.start();
    }

    /**
     * Halt the whole game engine (stop the logic ticker, tell the director to stop rendering).
     */
    stop(): Promise<void> {
        this.director.stop();
        return this.logicTicker.stop();
    }

    /** Entity ID pulling station. */
    pullId = () => (++this.nextId).toString();
    nextId = 0;

    /**
     * Attach an entity to this game.
     */
    attach(...entities: Entity[]): void {
        for (const entity of entities) {
            const id = this.pullId();
            entity.attach(this, id);
            this.state.entities[id] = entity;
        }
    }
}

/**
 * Structure of options for creating a new game.
 */
export interface GameOptions {
    log: Logger;
    hostElement: HTMLElement;
}

/** Log utility signature. */
export type Logger = (...messages: string[]) => void;

/** Structure of serializable game state data. */
export interface GameState {
    entities: {
        [id: string]: Entity;
    };
}
