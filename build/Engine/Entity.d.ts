import Game from "./Game";
import Stage from "./Stage";
import State from "./State";
import { TickInfo } from "./Ticker";
/**
 * Entity in the game world which responds to fresh entity state on logic ticks.
 * An entity doesn't actually need to persist any state, fresh state can just pass through the logic method.
 */
export default class Entity {
    /** Module ID for this entity class. Used to load entity classes on-the-fly. */
    static type: string;
    /** Unique ID tag for this entity instance. */
    tag: string;
    /** Human-friendly nickname for this entity instance. Doesn't have to be unique. Useful for entity queries. */
    label: string;
    /** Parent game instance. */
    protected game: Game;
    /** Parent world instance. */
    protected stage: Stage;
    /**
     * Create a new entity instance.
     * You can optionally provide your own label for each instance.
     */
    constructor(options: EntityOptions);
    /**
     * Initialize this entity.
     */
    protected initialize(): void;
    /**
     * Respond to fresh entity state on a logic tick.
     */
    logic(state: EntityState, tickInfo: TickInfo): {
        stateDelta: any;
    };
    /**
     * Handle being removed from the game.
     * Tear down any event subscriptions.
     */
    removal(): void;
    /**
     * Entity's aesthetic appearance in debugging logs.
     */
    toString(): string;
}
export interface EntityOptions {
    tag: string;
    label?: string;
    game: Game;
    stage: Stage;
}
export declare class EntityState extends State {
    type: string;
    label: string;
    constructor(options: EntityStateOptions);
}
export interface EntityStateOptions {
    type: string;
    label?: string;
}
export { TickInfo };
