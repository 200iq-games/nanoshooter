import Stage from "./Stage";
import Game, { GameState } from "./Game";
import Entity from "./Entity";
/**
 * Contain the entity instances of the game world.
 * Synchronizes with provided game state by adding or removing entities.
 * Responsible for dynamically loading and instancing entities.
 * Requires a stage reference, so it can be passed to each instanced entity.
 */
export default class World {
    /** Babylon stage. */
    private stage;
    /** Parent game instance. */
    private game;
    /** Collection of entity instances. */
    private entities;
    /**
     * Create a world instance with some world options.
     */
    constructor(options: WorldOptions);
    /**
     * Loop over each entity.
     */
    loopOverEntities(looper: (entity: Entity, tag: string) => void): void;
    /**
     * Synchronize the world with the provided game state data.
     *   - Add new state entities to the world (load them dynamically).
     *   - Remove extraneous state entities from the world.
     *   - Return a report of all added or removed entities.
     */
    conform(gameState: GameState): Promise<{
        added: Entity[];
        removed: string[];
    }>;
    /**
     * Load, instance, and add an entity to the game world based on provided entity state.
     */
    private addEntity(tag, state);
    /**
     * Remove an entity from the game world.
     */
    private removeEntity(tag);
}
export interface WorldOptions {
    stage: Stage;
    game: Game;
}
