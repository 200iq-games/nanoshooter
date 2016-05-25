
import Game from "./Game"
import {TickInfo} from "./Ticker"
import {Message} from "./World"

/**
 * Game world object.
 */
export default class Entity {

    /** Module ID for this entity class. Entity classes are referenced by this string in the serializable game state. */
    static type: string = "Nanoshooter/Entities/Entity"

    /** Unique identifier for this entity instance, assigned to this entity by the parent game during attachment. */
    tag: string

    /** Human-friendly nickname for this entity instance. Doesn't have to be unique. */
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
     * Run game logic for this entity, every tick.
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