
import State from "./State";

/**
 * A blank object in the game state.
 */
export default class Entity {
    name: string = "entity";
    id: string;

    constructor(options: EntityOptions) {
        this.id = options.id;
    }
}

export interface EntityOptions {
    id: string;
}
