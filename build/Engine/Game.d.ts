import Stage from "./Stage";
import { TickInfo } from "./Ticker";
import { EntityState } from "./Entity";
import State from "./State";
/**
 * 3D web game infrastructure.
 */
export default class Game {
    /** Logging utility function. */
    log: Logger;
    /** Stage which manages the Babylon scene. */
    private stage;
    /** Game state, source of truth that the world is based on. */
    private state;
    /** Maintains entity instances, synchronizes with game state. */
    private world;
    /** Game logic loop utility. */
    private logicTicker;
    /**
     * Initialize a game.
     * Create and wire up the engine components that the game is comprised of.
     */
    constructor({log, hostElement}?: GameOptions);
    /** Overridable game initialization step. */
    protected initialize(stage: Stage): void;
    /**
     * Add an entity to the game based on the provided entity state.
     * TODO: Make this return a promise of the true Entity instance within the World.
     */
    addEntity(entityState: EntityState): void;
    /**
     * Remove an entity from the state based on the provided entity tag string.
     * TODO: Make this return a promise that is resolved when the entity instance is actually removed from the world.
     */
    removeEntity(tag: string): void;
    /**
     * Run the whole game engine.
     */
    start(): void;
    /**
     * Halt the whole game engine.
     */
    stop(): Promise<void>;
    /**
     * Return the current number of frames being rendered per second.
     */
    getFramerate(): number;
}
export declare type Logger = (...messages: any[]) => void;
export interface GameOptions {
    log?: Logger;
    hostElement?: HTMLElement;
}
export declare class GameState extends State {
    /** Collection of entity state. */
    private entities;
    /** Entity tag pulling station. */
    private pullTag;
    private nextTag;
    /**
     * Loop over each entity state.
     */
    loopOverEntities(looper: (entityState: EntityState, tag: string) => void): void;
    /**
     * Obtain a particular entity's state.
     */
    getEntity(tag: string): EntityState;
    /**
     * Add entity state data.
     */
    addEntity(entityState: EntityState): void;
    /**
     * Remove an entity by state.
     */
    removeEntity(tag: string): void;
}
export { TickInfo };
