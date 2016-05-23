
import Entity from "./Entity";

/**
 * Serializable game state.
 */
export default class State {

    /** Collection of all entities described in the game universe. */
    private entities: {
        [id: string]: Entity;
    } = {};

    // Unique ID pulling station.
    private nextId = 0;
    private pullId = () => (++this.nextId).toString();

    /** Add entities to the game world. */
    attach(...entities: Entity[]) {
        for (const entity of entities) {
            let id = this.pullId();
            entity.attach(this, id);
            this.entities[id] = entity;
        }
    }
}

export interface StateOptions {
    entities: Entity[];
}
