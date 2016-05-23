
import Stateful, {State} from "./Stateful";
import Game from "./Game";

/**
 * Game world object.
 */
export default class Entity extends Stateful {

    /** Human-readable name for an entity. Doesn't have to be unique. */
    label: string = "Entity";

    /** Reference to the parent game instance. */
    game: Game;

    /** Unique identifier for this entity, assigned to this entity by the parent game during attachment. */
    id: string;

    /** Serializable state for this entity. */
    state: EntityState = {};

    /**
     * Create a new Entity.
     * You can optionally provide a label for each instance.
    */
    constructor(options: EntityOptions) {
        super();

        if (options.label)
            this.label = options.label;
    }

    /**
     * Attach this entity to a game instance with the provided ID.
     * For usage by the game instance.
     */
    attach(game: Game, id: string) {
        this.game = game;
        this.id = id;
    }

    /**
     * Aesthetic appearance for debugging logs.
     */
    toString() {
        return `<${this.label}${this.id?' id='+this.id:''}>`;
    }
}

/**
 * Structure of options for instancing a new entity.
 */
export interface EntityOptions {
    label?: string;
}

/**
 * Structure of serializable entity state data.
 */
export interface EntityState {}
