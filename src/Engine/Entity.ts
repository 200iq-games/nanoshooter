
import Game from "./Game"
import {TickInfo} from "./Ticker"

/**
 * Game world object.
 */
export default class Entity {

    /** Module ID for this entity class. Used to load entity classes on-the-fly. */
    static type: string = "Nanoshooter/Entities/Entity"

    /** Unique ID tag for this entity instance. */
    tag: string

    /** Human-friendly nickname for this entity instance. Doesn't have to be unique. Useful for entity queries. */
    label: string

    /**
     * Create a new entity instance.
     * You can optionally provide your own label for each instance.
     */
    constructor({tag, label = ""}: EntityOptions) {
        this.tag = tag
        this.label = label
    }

    /**
     * Run game logic for this entity.
     */
    logic(entityState: EntityState, tickInfo: TickInfo) {}

    /**
     * Send a message to remote copies of this entity.
     */
    send(message: Message) { this.receive(message) }

    /**
     * Handle a message received from a remote copy of this entity.
     */
    receive(message: Message) {}

    /**
     * Handle being removed from the game.
     * Tear down any event subscriptions.
     */
    removal() {}

    /**
     * Entity's aesthetic appearance in debugging logs.
     */
    toString() {
        return `<${this.label}${this.tag?' id='+this.tag:''}>`
    }
}

/**
 * Options for creating an entity.
 */
export interface EntityOptions {
    tag: string
    label?: string
}

/**
 * Serializable state for an entity.
 */
export interface EntityState {
    type?: string
    label?: string
}

/**
 * Message to world entities.
 */
export interface Message {

    /** Message data body. */
    payload: any
}
