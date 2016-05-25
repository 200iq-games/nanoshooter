
import World from "./World"
import Stage from "./Stage"
import Entity, {EntityState} from "./Entity"
import Ticker, {TickInfo} from "./Ticker"

/**
 * Networkable 3D web game infrastructure.
 * This class connects together the components
 */
export default class Game {

    /** JSON data that describes the entire game world. */
    state: GameState;

    /** Maintains entity instances, synchronizes with game state. */
    world: World

    /** Manages the Babylon game scene. */
    stage: Stage

    /** Game logic loop utility. */
    ticker: Ticker

    /** Logging utility. */
    log: Logger

    /**
     * Initialize a game.
     */
    constructor({
      hostElement = document.body,
      log = logger
    }: GameOptions = {}) {
        const startTime = (+new Date)

        // Wire up the components that make a game happen.
        this.log = log;
        this.state = { entities: {} }
        this.world = new World()
        this.stage = new Stage({hostElement})
        this.ticker = new Ticker({
            tick: info => this.logic(info)
        })

        const endTime = (+new Date)
        const loadingTime = (startTime - performance.timing.navigationStart).toFixed(0)
        const gameInitTime = (endTime - startTime).toFixed(0)
        const totalStartupTime = (endTime - performance.timing.navigationStart).toFixed(0)
        log(`Total startup ${totalStartupTime} ms – Page loading ${loadingTime} ms – Game initialization ${gameInitTime} ms`)
    }

    /**
     * Add an entity by state.
     */
    addEntity(entityState: EntityState) {
        const {state} = this
        const tag = this.pullTag()
        state.entities[tag] = entityState
        if (!entityState.type) throw "type required in entityState"
        if (!entityState.label) throw "label required in entityState"
    }

    /**
     * Remove an entity by state.
     */
    removeEntity(tag: string) {
        const {state} = this
        delete state.entities[tag]
    }

    /**
     * Run the whole game engine (start the logic ticker, prompt the director to start rendering).
     */
    start() {
        this.ticker.start()
        this.stage.start()
    }

    /**
     * Halt the whole game engine (stop the logic ticker, tell the director to stop rendering).
     */
    stop(): Promise<void> {
        this.stage.stop()
        return this.ticker.stop()
    }

    /** Entity tag pulling station. */
    protected pullTag = () => (++this.nextTag).toString()
    private nextTag = 0

    /**
     * Game logic tick.
     */
    protected logic(tickInfo: TickInfo) {
        const {world, state} = this
        world.sync(state)
        world.logic(state, tickInfo)
    }
}

/**
 * Simple log function, outputs to the console.
 */
export const logger: Logger = (...messages: any[]) => console.log.apply(console, messages)
export type Logger = (...messages: any[]) => void

export interface GameOptions {
    log?: Logger
    hostElement?: HTMLElement
}

export interface GameState {
    entities: { [tag: string]: EntityState }
}
