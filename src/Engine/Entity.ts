
import Stateful, {State} from "./Stateful";
import Game from "./Game";
import {TickInfo} from "./Ticker";
import {Message} from "./Messenger";

/**
 * Game world object.
 */
export default class Entity extends Stateful {

    /** Human-readable name for an entity. Doesn't have to be unique. */
    label: string = "Entity";

    /** Reference to the parent game. */
    game: Game;

    /** Unique identifier for this entity, assigned to this entity by the parent game during attachment. */
    id: string;

    /** Serializable state for this entity. */
    state: EntityState = {};

    /**
     * Create a new Entity, and have it attached to a game instance.
     * You can optionally provide your own label for each instance.
     */
    constructor(options: EntityOptions) {
        super();

        this.game = options.game;
        this.id = options.id;
        this.game.add(this);

        if (options.label)
            this.label = options.label;
    }

    /**
     * Run game logic for this entity, every tick.
     */
    logic(info: TickInfo) {}

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
        return `<${this.label}${this.id?' id='+this.id:''}>`;
    }
}

/**
 * Structure of options for instancing a new entity.
 */
export interface EntityOptions {
    game: Game;
    id: string;
    label?: string;
}

/**
 * Structure of serializable entity state data.
 */
export interface EntityState extends State {}
