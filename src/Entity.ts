
import State from "./State";

/**
 * A blank object in the game state.
 */
export default class Entity {
    name: string;
    state: State;
    id: string;

    constructor(options: EntityOptions) {
        this.name = (options.name !== undefined)
            ? options.name
            : "entity";
    }

    /** Attach this entity to a game state and assign an ID. */
    attach(state: State, id: string) {
        this.state = state;
        this.id = id;
    }

    /** Entity text display for debugging logs. */
    toString() {
        return `<${this.name}${this.id?' id='+this.id:''}>`;
    }
}

export interface EntityOptions {

    /** Human-readable label for this particular entity instance. */
    name?: string;
}
