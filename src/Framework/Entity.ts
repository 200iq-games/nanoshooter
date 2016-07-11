
import Game from './Game'
import World from './World'
import Stage from './Stage'
import Loader from './Loader'
import State from './State'
import {TickReport} from './Ticker'
export {TickReport}

/**
 * Options for creating an Entity instance.
 */
export interface EntityOptions {
  id: string
  entityState: EntityState
  world: World
  game: Game
  stage: Stage
  loader: Loader
  tags?: string[]
}

/**
 * Entity in the game world which responds to fresh entity state on logic ticks.
 * An entity doesn't actually need to persist any state, fresh state can just pass through the logic method.
 */
export default class Entity {

  /** Module ID for this entity class. Used to load entity classes on-the-fly. */
  static type: string = 'Nanoshooter/Entities/Entity'

  /** Module ID for this entity class. Cleverly copied from the static variable. */
  type: string = (<typeof Entity>this.constructor).type

  /** Unique ID tag. */
  id: string

  /** Searchable tag strings related to this entity. Optional. */
  tags: string[]

  /** World instance. Entities can query for and access other entity instances. */
  protected world: World

  /** Parent game instance. Entities have the right to manipulate the game on a high level (start/stop, etc). */
  protected game: Game

  /** Stage instance. Entities have full access to the Babylon API that the stage exposes. */
  protected stage: Stage

  /** Art loader instance. Allows the entity to load art asset files, like .obj's, sounds, or images. */
  protected loader: Loader

  /**
   * Create a new entity instance.
   * You can optionally provide your own label for each instance.
   */
  constructor(options: EntityOptions) {
    this.id = options.id
    this.tags = options.tags || []
    this.game = options.game
    this.stage = options.stage
    this.loader = options.loader

    this.initialize(options.entityState)
  }

  /**
   * Initialize this entity with the provided state.
   */
  protected initialize(state: EntityState) {}

  /**
   * Respond to fresh entity state on a logic tick.
   */
  logic(input: EntityLogicInput): EntityLogicOutput { return undefined }

  /**
   * Make it look pretty in the console logs.
   */
  toString() { return `<${this.type}-${this.id}>` }

  /**
   * Clean up this entity for removal from the game.
   * Tear down any event subscriptions, etc.
   */
  destructor() {}
}

export interface EntityLogicInput {
  entityState: EntityState
  tickReport: TickReport
}

export interface EntityLogicOutput {
  entityStateDelta: any
}

export interface EntityState {
  type: string
  tags?: string[]
}
