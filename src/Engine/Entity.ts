
import Game from "./Game"
import Stage from "./Stage"
import {TickInfo} from "./Ticker"

/**
 * Game world object which runs logic on every tick.
 */
export default class Entity {

    /** Module ID for this entity class. Used to load entity classes on-the-fly. */
    static type: string = "Nanoshooter/Entities/Entity"

    /**
     * Create a new entity instance.
     * You can optionally provide your own label for each instance.
     */
    constructor({stage, tag, label = ""}: EntityOptions) {
        this.stage = stage
        this.tag = tag
        this.label = label

        this.initialize()
    }

    /** Access to the Babylon scene. */
    stage: Stage

    /** Unique ID tag for this entity instance. */
    tag: string

    /** Human-friendly nickname for this entity instance. Doesn't have to be unique. Useful for entity queries. */
    label: string

    /**
     * Entity initialization.
     */
    initialize() {}

    /**
     * Run game logic for this entity.
     */
    logic(state: EntityState, tickInfo: TickInfo): { stateDelta: any } {
        return undefined
    }

    /**
     * Send a message (reliably) to remote copies of this entity.
     */
    send(message: EntityMessage) { this.receive(message) }

    /**
     * Handle a message received from a remote copy of this entity.
     */
    receive(message: EntityMessage) {}

    /**
     * Handle being removed from the game.
     * Tear down any event subscriptions.
     */
    removal() {}

    /**
     * Entity's aesthetic appearance in debugging logs.
     */
    toString() {
        return `<${this.tag}${this.label?'-':''}${this.label}>`
    }
}

export interface EntityOptions {
    stage: Stage
    tag: string
    label?: string
}

export interface EntityState {
    type: string
    label?: string
}

export interface EntityLogicReturns {
    stateDelta: { [key: string]: string }
}

export interface EntityMessage {

    /** Message data body. */
    payload: any
}

export {TickInfo}
