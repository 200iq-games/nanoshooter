
import Entity from "./Entity"
import {TickInfo} from "./Ticker"
import {GameState, Logger} from "./Game"
declare const require: (moduleIds: string[], callback?: (...modules:any[]) => void, errback?: (error: Error) => void) => void

/**
 * Game world, based on game state as input.
 * Contains entities.
 */
export default class World {

    /** Function for logging interesting world events. */
    private log: Logger

    /** Entity. */
    private entities: { [tag: string]: Entity } = {}

    /**
     * Create a world instance with some world options.
     */
    constructor({log}: WorldOptions) {
        this.log = log
    }

    /**
     * Synchronize the world to the provided game state data.
     *   - Add new state entities to the world (load them dynamically).
     *   - Remove extraneous state entities from the world.
     */
    sync(state: GameState): Promise<void> {

        // Add entities that are in the state, but not in the entities collection.
        for (const tag of Object.keys(state.entities)) {
            const entityState = state.entities[tag]
            const entity = this.entities[tag]
            if (!entity) { // Entity is missing (is present in the state).
                return new Promise<void>((resolve, reject)=>{
                    require([entityState.type], module => {
                        this.entities[tag] = new module.default({
                            tag,
                            label: entityState.label
                        })
                    }, error => { throw error })
                });
            }
        }

        // Remove entities that are in the entities collection, but not in the state.
        for (const tag of Object.keys(this.entities)) {
            const entity = this.entities[tag]
            const entityState = state.entities[tag]

            if (!entityState) { // Entity is extraneous (not present in state).
                entity.removal()
                delete this.entities[tag]
            }
        }

        return Promise.resolve();
    }

    /**
     * Loop over all entities and run their logic routines.
     */
    logic(state: GameState, tickInfo: TickInfo) {
        for (const tag of Object.keys(state.entities)) {
            const entityState = state.entities[tag]
            const entity = this.entities[tag]
            if (entity) entity.logic(entityState, tickInfo)
        }
    }

    /**
     * Deliver a message.
     * TODO: Entities should ONLY be able to message THEMSELVES.
     *   Why? Entities will be allowed to keep direct references to other entities, and even query for world entities.
     *   Messaging isn't about 
     */
    sendMessage(message: Message) {
        let delivered = false;

        for (const tag of Object.keys(this.entities)) {
            const entity = this.entities[tag]

            // Broadcast message.
            if (message.recipients === "*") {
                entity.receive(message)
                delivered = true
            }

            // Targeted message.
            else if (message.recipients.constructor === Array) {
                const recipients = <string[]> message.recipients
                if (recipients.some(id => id === entity.tag)) {
                    entity.receive(message)
                    delivered = true
                }
            }

            else throw "Unknown type for message recipients"
        }

        if (!delivered) throw "Message delivery failed"
    }
}

export interface WorldOptions {
    log: Logger
}

/**
 * Message to world entities.
 */
export interface Message {

    /** Array of recipient entity tag strings, or "*" indicating broadcast to all entities. */
    recipients: string | string[]

    /** Message data body. */
    data: any
}
