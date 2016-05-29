
import World from "./World"
import Stage from "./Stage"
import Entity, {EntityState} from "./Entity"
import Ticker, {TickInfo} from "./Ticker"

/**
 * Networkable 3D web game infrastructure.
 */
export default class Game extends Stage {

    /**
     * Initialize a game.
     */
    constructor({log, hostElement}: GameOptions = {}) {
        super({hostElement})
        this.state = { entities: {} }
        this.world = new World({log, game: this})
        this.logicTicker = new Ticker({
            tick: tickInfo => {
                this.world.sync(this.state)
                this.world.loop((entity, tag) => entity.logic(this.state.entities[tag], tickInfo))
            }
        })
        this.initialize()
    }

    /** JSON data that describes the entire game world. */
    state: GameState

    /** Maintains entity instances, synchronizes with game state. */
    world: World

    /** Game logic loop utility. */
    logicTicker: Ticker

    /** Logging utility. */
    log: Logger

    /**
     * Apply a game state delta patch.
     */
    applyState(delta: GameState) {}

    /**
     * Add an entity by state.
     */
    addEntity(state: EntityState) {
        const tag = this.pullTag()
        if (!state.type) throw "type required in entity state"
        if (!state.label) throw "label required in entity state"
        this.state.entities[tag] = state
    }

    /**
     * Remove an entity by state.
     */
    removeEntity(tag: string) {
        delete this.state.entities[tag]
    }

    /**
     * Run the whole game engine (start the logic ticker, prompt the director to start rendering).
     */
    start() {
        this.logicTicker.start()
        super.start()
    }

    /**
     * Halt the whole game engine (stop the logic ticker, tell the director to stop rendering).
     */
    stop(): Promise<void> {
        super.stop()
        return this.logicTicker.stop()
    }

    /** Entity tag pulling station. */
    private pullTag = () => (++this.nextTag).toString()
    private nextTag = 0
}

/**
 * Simple log function, outputs to the console.
 */
export type Logger = (...messages: any[]) => void

export interface GameOptions {
    log?: Logger
    hostElement?: HTMLElement
}

export interface GameState {
    entities: { [tag: string]: EntityState }
}

export {TickInfo}
