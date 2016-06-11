
import Stage from "./Stage"
import Game, {GameState} from "./Game"
import Entity, {EntityState} from "./Entity"
import {TickInfo} from "./Ticker"
declare const require: (moduleIds: string[], callback?: (...modules:any[]) => void, errback?: (error: Error) => void) => void

/**
 * Contain the entity instances of the game world.
 * Synchronizes with provided game state by adding or removing entities.
 * Responsible for dynamically loading and instancing entities.
 * Requires a stage reference, so it can be passed to each instanced entity.
 */
export default class World {

  /** Babylon stage. */
  private stage: Stage

  /** Parent game instance. */
  private game: Game

  /** Collection of entity instances. */
  private entities: { [tag: string]: Entity } = {}

  /**
   * Create a world instance with some world options.
   */
  constructor(options: WorldOptions) {
    this.stage = options.stage
    this.game = options.game
  }

  /**
   * Loop over each entity.
   */
  loopOverEntities(looper: (entity: Entity, tag: string) => void): void {
    for (const tag of Object.keys(this.entities)) {
      const entity = this.entities[tag]

      // Don't loop over null entities (which are currently loading).
      if (entity) looper(entity, tag)
    }
  }

  /**
   * Synchronize the world with the provided game state data.
   *   - Add new state entities to the world (load them dynamically).
   *   - Remove extraneous state entities from the world.
   *   - Return a report of all added or removed entities.
   */
  conform(gameState: GameState): Promise<{ added: Entity[]; removed: string[] }> {
    const added: Promise<Entity>[] = []
    const removed: Promise<string>[] = []

    // Add entities that are present in the game state, but are missing from this world.
    gameState.loopOverEntities((entityState, tag) => {
      if (!this.entities.hasOwnProperty(tag))
        added.push(
          this.addEntity(tag, entityState).then(() => undefined)
        )
    })

    // Remove entities that are missing from the game state, but are present in this game world.
    gameState.loopOverEntities((entityState, tag) => {
      if (!gameState.getEntity(tag))
        removed.push(
          this.removeEntity(tag).then(() => tag)
        )
    })

    // Return a report of all added or removed entities.
    return Promise.all([Promise.all(added), Promise.all(removed)]).then((results: any) => ({
      added: results[0],
      removed: results[1]
    }))
  }

  /**
   * Load, instance, and add an entity to the game world based on provided entity state.
   */
  private addEntity(tag: string, state: EntityState): Promise<Entity> {
    return new Promise<Entity>((resolve, reject) => {

      // Entity is set to null in the collection while the entity is loading.
      // If we didn't do this, the world might perform another sync during
      this.entities[tag] = null

      // Load the entity.
      require(
        [state.type],
        entityModule => {

          // Instance the entity.
          const entity = new (<typeof Entity>entityModule.default)({
            stage: this.stage,
            game: this.game,
            tag,
            label: state.label
          })

          // Add the entity to the entities collection.
          this.entities[tag] = entity

          // Log about it.
          this.game.log(`(+) Added entity ${entity}`)

          // Resolve the promise with the added entity.
          resolve(entity)
        },

        // Handle loading error by rejecting the promise.
        error => { reject(error) }
      )
    })
  }

  /**
   * Remove an entity from the game world.
   */
  private removeEntity(tag: string): Promise<void> {
    const entity = this.entities[tag]
    entity.removal()
    delete this.entities[tag]
    this.game.log(`(-) Removed entity ${entity}`)
    return Promise.resolve()
  }
}

export interface WorldOptions {
  stage: Stage
  game: Game
}
