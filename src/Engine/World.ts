
import Entity from "./Entity"
import {TickInfo} from "./Ticker"
import {GameState, Logger} from "./Game"
declare const require: (moduleIds: string[], callback?: (...modules:any[]) => void, errback?: (error: Error) => void) => void

/**
 * Game world, based on game state as input.
 * Contains entities.
 */
export default class World {

    /**
     * Create a world instance with some world options.
     */
    constructor({log}: WorldOptions) {
        this.log = log
    }

    /** Function for logging interesting world events. */
    private log: Logger

    /** Entity. */
    private entities: { [tag: string]: Entity } = {}

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
                        this.log(`(+) Added ${this.entities[tag]}`)
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
                this.log(`(-) Removed ${entity}`)
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
}

export interface WorldOptions {
    log: Logger
}
