
import Stage from "./Stage"
import Entity, {EntityState} from "./Entity"
import {TickInfo} from "./Ticker"
import {GameState, Logger} from "./Game"
declare const require: (moduleIds: string[], callback?: (...modules:any[]) => void, errback?: (error: Error) => void) => void

/**
 * Collection of game entities
 */
export default class World {

    /**
     * Create a world instance with some world options.
     */
    constructor({log, stage}: WorldOptions) {
        this.log = log
        this.stage = stage
    }

    /** Debug log function. */
    private log: Logger

    /** Babylon scene. */
    private stage: Stage

    /** Entity. */
    private entities: { [tag: string]: Entity } = {}

    /**
     * Run the logic routine for every entity.
     */
    logic(state: GameState, tickInfo: TickInfo) {
        for (const tag of Object.keys(state.entities)) {
            const entityState = state.entities[tag]
            const entity = this.entities[tag]
            if (entity) entity.logic(entityState, tickInfo)
        }
    }

    /**
     * Synchronize the world with the provided game state data.
     *   - Add new state entities to the world (load them dynamically).
     *   - Remove extraneous state entities from the world.
     *   - Return a report of all added or removed entities.
     */
    sync(state: GameState): Promise<{ added: Entity[]; removed: string[] }> {
        const added: Promise<Entity>[] = []
        const removed: Promise<string>[] = []

        // Add entities that are in the state, but not in the entities collection.
        for (const tag of Object.keys(state.entities))
            if (!this.entities.hasOwnProperty(tag)) added.push(
                this.addEntity(tag, state.entities[tag]).then(() => undefined)
            )

        // Remove entities that are in the entities collection, but not in the state.
        for (const tag of Object.keys(this.entities))
            if (!state.entities.hasOwnProperty(tag)) removed.push(
                this.removeEntity(tag).then(() => tag)
            )

        // Return a report of all added or removed entities.
        return Promise.all([Promise.all(added), Promise.all(removed)]).then((results: any) => ({
            added: results[0],
            removed: results[1]
        }))
    }

    /**
     * Load an entity, instance it, and add it to the game world.
     */
    private addEntity(tag: string, entityState: EntityState): Promise<Entity> {
        return new Promise<Entity>((resolve, reject) => require(
            [entityState.type],
            entityModule => {
                const entity = new entityModule.default({
                    stage: this.stage,
                    tag,
                    label: entityState.label
                })
                this.entities[tag] = entity
                this.log(`(+) Added ${entity}`)
                resolve(entity)
            },
            error => { throw error }
        ))
    }

    /**
     * Remove an entity from the game world.
     */
    private removeEntity(tag: string): Promise<void> {
        const entity = this.entities[tag]
        entity.removal()
        delete this.entities[tag]
        this.log(`(-) Removed ${entity}`)
        return Promise.resolve()
    }
}

export interface WorldOptions {
    log: Logger
    stage: Stage
}
