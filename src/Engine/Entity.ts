
import Game from "./Game"
import {TickInfo} from "./Ticker"
import {Message} from "./World"

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
     * Handle messages received from other entities.
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

export interface EntityOptions {
    tag: string
    label?: string
}

export interface EntityState {
    type?: string
    label?: string
}