
import Stateful from "./Stateful";
import Ticker, {TickInfo} from "./Ticker";
import Messenger from "./Messenger";
import Director from "./Director";
import Entity from "./Entity";

/**
 * Networkable 3D web game infrastructure.
 * Establishes a robust serializble game state and network-ready game logic engine.
 * Employs the 'director' to bring the game state to life with Babylon.
 */
export default class Game {

    /** All entities in the game world. This is the core of the game's state. */
    entities: { [id: string]: Entity; } = {};

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

    /** Delivers entity messages. */
    messenger: Messenger;

    /**
     * Initialize a game.
     *   - Create the director.
     *   - Establish the game logic loop ticker.
     *   - Log some nifty timing info.
     */
    constructor(options: GameOptions) {
        this.log = options.log;
        const startTime = (+new Date);

        // The director manages the Babylon scene based on this game's state.
        this.director = new Director({
            game: this,
            hostElement: options.hostElement
        });

        // System for entities to send messages to each other.
        this.messenger = new Messenger(this);

        // We establish our own ticker for game logic (the babylon rendering loop is managed by the director).
        this.logicTicker = new Ticker(info => this.logic(info));

        const endTime = (+new Date);
        const loadingTime = (startTime - performance.timing.navigationStart).toFixed(0);
        const gameInitTime = (endTime - startTime).toFixed(0);
        const totalStartupTime = (endTime - performance.timing.navigationStart).toFixed(0);
        this.log(`Total startup ${totalStartupTime} ms – Page loading ${loadingTime} ms – Game initialization ${gameInitTime} ms`);
    }

    /** Entity ID pulling station. */
    pullId = () => (++this.nextId).toString();
    nextId = 0;

    /**
     * Add an entity to this game.
     */
    add(entity: Entity) {
        this.entities[entity.id] = entity;
    }

    /**
     * Remove an entity from this game.
     */
    remove(entity: Entity) {
        entity.removal();
        delete this.entities[entity.id];
    }

    /**
     * Game logic loop.
     * All game logic occurs here.
     * We'll probably want to poke the director from here a lot.
     */
    logic(info: TickInfo) {
        ++this.diagnostics.totalTicks;

        // Loop over all entities and run their logic routines.
        for (const id of Object.keys(this.entities)) {
            const entity = this.entities[id];
            entity.logic(info);
        }
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
}

/**
 * Structure of options for creating a new game.
 */
export interface GameOptions {
    log: Logger;
    hostElement: HTMLElement;
}

/** Log utility signature. */
export type Logger = (...messages: any[]) => void;
