
import Stage from "./Stage"
import World from "./World"
import Ticker, {TickInfo} from "./Ticker"
import Entity, {EntityState} from "./Entity"
import State from "./State"

/**
 * 3D web game infrastructure.
 */
export default class Game {

    /** Logging utility function. */
    log: Logger

    /** Stage which manages the Babylon scene. */
    protected stage: Stage

    /** Game state, source of truth that the world is based on. */
    private state: GameState

    /** Maintains entity instances, synchronizes with game state. */
    private world: World

    /** Game logic loop utility. */
    private logicTicker: Ticker

    /**
     * Initialize a game.
     * Create and wire up the engine components that the game is comprised of.
     */
    constructor({log, hostElement}: GameOptions = {}) {

        // Attach the public logging function.
        this.log = log

        // Create the Babylon stage.
        this.stage = new Stage({hostElement})

        // Create the source-of-truth game state.
        this.state = new GameState()

        // Create the game world, which contains entity instances and conforms to the game state.
        this.world = new World({game: this, stage: this.stage})

        // Create the ticker which runs game logic.
        this.logicTicker = new Ticker({

            // Function for each logic tick.
            tick: tickInfo => {

                // Sync the game world to match the game state.
                this.world.conform(this.state)

                // Run all entity logic.
                this.world.loopOverEntities((entity, tag) => entity.logic(this.state.getEntity(tag), tickInfo))
            }
        })

        // Initialize this game.
        this.initialize()
    }

    /** Overridable game initialization step. */
    protected initialize() {}

    /**
     * Add an entity to the game based on the provided entity state.
     * TODO: Make this return a promise of the true Entity instance within the World.
     */
    addEntity(entityState: EntityState) {
        this.state.addEntity(entityState)
    }

    /**
     * Remove an entity from the state based on the provided entity tag string.
     * TODO: Make this return a promise that is resolved when the entity instance is actually removed from the world.
     */
    removeEntity(tag: string) {
        this.state.removeEntity(tag)
    }

    /**
     * Run the whole game engine.
     */
    start() {
        this.stage.start()
        this.logicTicker.start()
    }

    /**
     * Halt the whole game engine.
     */
    stop(): Promise<void> {
        this.stage.stop()
        return this.logicTicker.stop()
    }

    /**
     * Return the current number of frames being rendered per second.
     */
    getFramerate(): number {
        return this.stage.engine.getFps()
    }
}

/**
 * Simple log function, outputs to the console.
 */
export type Logger = (...messages: any[]) => void

export interface GameOptions {
    log?: Logger
    hostElement?: HTMLElement
}

export class GameState extends State {

    /** Collection of entity state. */
    private entities: { [tag: string]: EntityState } = {}

    /** Entity tag pulling station. */
    private pullTag = () => (++this.nextTag).toString()
    private nextTag = 0

    /**
     * Loop over each entity state.
     */
    loopOverEntities(looper: (entityState: EntityState, tag: string) => void): void {
        for (const tag of Object.keys(this.entities))
            looper(this.entities[tag], tag)
    }

    /**
     * Obtain a particular entity's state.
     */
    getEntity(tag: string) {
        return this.entities[tag]
    }

    /**
     * Add entity state data.
     */
    addEntity(entityState: EntityState) {
        this.entities[this.pullTag()] = entityState
    }

    /**
     * Remove an entity by state.
     */
    removeEntity(tag: string) {
        delete this.entities[tag]
    }
}

export {TickInfo}
