
import World from "./World"
import Stage from "./Stage"
import Entity, {EntityState} from "./Entity"
import Ticker, {TickInfo} from "./Ticker"

/**
 * Networkable 3D web game infrastructure.
 */
export default class Game {

    /**
     * Initialize a game.
     */
    constructor({log, hostElement}: GameOptions = {}) {
        this.state = { entities: {} }
        this.stage = new Stage({hostElement})
        this.world = new World({log, stage: this.stage})
        this.logicTicker = new Ticker({
            tick: tickInfo => {
                this.world.sync(this.state)
                this.world.logic(this.state, tickInfo)
            }
        })
    }

    /** JSON data that describes the entire game world. */
    protected state: GameState

    /** Babylon game scene. */
    protected stage: Stage

    /** Maintains entity instances, synchronizes with game state. */
    protected world: World

    /** Game logic loop utility. */
    protected logicTicker: Ticker

    /** Logging utility. */
    protected log: Logger

    /**
     * Add an entity by state.
     */
    addEntity(entityState: EntityState) {
        const tag = this.pullTag()
        if (!entityState.type) throw "type required in entityState"
        if (!entityState.label) throw "label required in entityState"
        this.state.entities[tag] = entityState
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
        this.stage.start()
    }

    /**
     * Halt the whole game engine (stop the logic ticker, tell the director to stop rendering).
     */
    stop(): Promise<void> {
        this.stage.stop()
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
