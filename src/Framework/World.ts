
import Game, {GameState, Logger} from './Game'
import Stage from './Stage'
import State from './State'
import Loader from './Loader'
import Entity, {EntityState} from './Entity'
import {TickReport} from './Ticker'
declare const require: (moduleIds: string[], callback?: (...modules: any[]) => void, errback?: (error: Error) => void) => void

/**
 * Inputs for a new world instance.
 */
export interface WorldOptions {
  game: Game
  stage: Stage
  loader: Loader
  log?: Logger
}

/**
 * Game world, which contains entity instances which imitate the game state.
 * Contain the entity instances of the game world.
 * Synchronizes with provided game state by adding or removing entities.
 * Responsible for dynamically loading and instancing entities.
 * Requires a stage reference, so it can be passed to each instanced entity.
 */
export default class World {

  /** Parent game instance. */
  protected game: Game

  /** Babylon stage. */
  protected stage: Stage

  /** Loads object files and images. */
  protected loader: Loader

  /** Logger for world events. */
  protected log: Logger

  /** Collection of entity instances. */
  protected entities: { [id: string]: Entity } = {}

  /** Getter which provides an array version of entities. */
  get entityArray(): Entity[] { return Object.keys(this.entities).map(id => this.entities[id]) }

  /**
   * Create a world instance with some world options.
   */
  constructor(options: WorldOptions) {
    this.game = options.game
    this.stage = options.stage
    this.loader = options.loader
    this.log = options.log || this.game.log
  }

  /**
   * Query for entities by searching through their tags.
   *  - Search through tags with a string (looking for exact match), or use a regular expression.
   */
  query(terms: (string | RegExp)[] = []): Entity[] {

    return this.entityArray.filter(entity => {
      const matchingTerms = terms.filter(term =>
        entity.tags.filter(tag =>
          typeof term === 'string' ? tag === term : term.test(tag)
        ).length > 0
      )

      // Entity matches when all terms match.
      return matchingTerms.length === terms.length
    })
  }

  /**
   * Loop over each entity.
   */
  loopOverEntities(looper: (entity: Entity) => void): void {

    // Take the array of object keys, which are entity IDs.
    Object.keys(this.entities)

      // Map the IDs to the entity instances themselves.
      .map(id => this.entities[id])

      // Filter out null entities (which indicates that they are still loading).
      .filter(entity => !!entity)

      // Run each entity through the looper.
      .forEach(looper)
  }

  /**
   * Run all game logic routines.
   *  - Add new entities to the world (load them dynamically).
   *  - Remove extraneous entities from the world.
   *  - Run all entity logic.
   *  - Return a final logic report, which includes all added or removed entities.
   */
  logic({gameState, tickReport}: WorldLogicInput): Promise<WorldLogicOutput> {
    const added: Promise<Entity>[] = []
    const removed: Promise<string>[] = []

    // Add entities that are present in the game state, but are missing from this world.
    gameState.loopOverEntities((entityState, id) => {
      if (!this.entities.hasOwnProperty(id))
        added.push(this.summonEntity(id, entityState).then(() => undefined))
    })

    // Remove entities that are missing from the game state, but are present in this game world.
    gameState.loopOverEntities((entityState, id) => {
      if (!gameState.getEntityState(id))
        removed.push(this.removeEntity(id).then(() => id))
    })

    // Run all entity logic.
    this.loopOverEntities(entity => {
      entity.logic({
        entityState: gameState.getEntityState(entity.id),
        tickReport
      })
    })

    // Return a report of all added or removed entities.
    return Promise.all([Promise.all(added), Promise.all(removed)])
      .then((results: any) => ({
        added: results[0],
        removed: results[1]
      }))
  }

  /**
   * Dynamically load up and instantiate an entity provided entity state.
   */
  private summonEntity(id: string, entityState: EntityState): Promise<Entity> {
    return new Promise<Entity>((resolve, reject) => {

      // Entity is set to null in the collection while the entity is loading.
      // If we didn't do this, the world might perform another sync during
      this.entities[id] = null

      // Load the entity.
      require(
        [entityState.type],
        entityModule => {

          // Instantiate the entity.
          const entity = new (<typeof Entity>entityModule.default)({
            id,
            entityState,
            tags: entityState.tags,
            world: this,
            game: this.game,
            stage: this.stage,
            loader: this.loader
          })

          // Add the entity to the entities collection.
          this.entities[id] = entity

          // Log about it.
          this.log(`(+) Added entity ${entity}`)

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
  private removeEntity(id: string): Promise<void> {
    const entity = this.entities[id]
    entity.destructor()
    delete this.entities[id]
    this.log(`(-) Removed entity ${entity}`)
    return Promise.resolve()
  }

  /**
   * Destruct all entities and shut down.
   * This allows all event bindings and such to be cleaned up.
   */
  destructor() {}
}

export interface WorldLogicInput {
  gameState: GameState
  tickReport: TickReport
}

export interface WorldLogicOutput {

  /** Entity instances which were added. */
  added: Entity[]

  /** The IDs of entity instances which were removed. */
  removed: string[]
}
