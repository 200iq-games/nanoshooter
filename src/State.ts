
import Entity from "./Entity";

/**
 * Serializable game state.
 */
export default class State {

    /** Collection of all entities described in the game universe. */
    private entities: {
        [id: string]: Entity;
    } = {};

    /** Add entities to the game world. */
    add(...entities: Entity[]) {
        for (const entity of entities)
            this.entities[entity.id] = entity;
    }
}

export interface StateOptions {
    entities: Entity[];
}
