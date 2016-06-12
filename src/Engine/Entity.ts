
import Game from "./Game"
import World from "./World"
import Stage from "./Stage"
import Loader from "./Loader"
import State from "./State"
import {TickInfo} from "./Ticker"

/**
 * Options for creating an Entity instance.
 */
export interface EntityOptions {
  tag: string
  game: Game
  stage: Stage
  loader: Loader
  label?: string
}

/**
 * Entity in the game world which responds to fresh entity state on logic ticks.
 * An entity doesn't actually need to persist any state, fresh state can just pass through the logic method.
 */
export default class Entity {

  /** Module ID for this entity class. Used to load entity classes on-the-fly. */
  static type: string = "Nanoshooter/Entities/Entity"

  /** Unique ID tag. */
  tag: string

  /** Human-friendly nickname for this entity instance. Doesn't have to be unique. Useful for entity queries. */
  label: string

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
    this.tag = options.tag
    this.label = options.label || ""
    this.game = options.game
    this.stage = options.stage
    this.loader = options.loader

    this.initialize()
  }

  /**
   * Initialize this entity.
   */
  protected initialize() {}

  /**
   * Respond to fresh entity state on a logic tick.
   */
  logic(input: LogicInput): LogicReturns { return undefined }

  /**
   * Handle being removed from the game.
   * Tear down any event subscriptions.
   */
  removal() {}

  /**
   * Entity's aesthetic appearance in debugging logs.
   */
  toString() { return `<${this.tag}${this.label?'-':''}${this.label}>` }
}

export interface LogicInput {
  entityState: EntityState,
  tickInfo: TickInfo
}

export interface LogicReturns {
  stateDelta: any
}

export class EntityState extends State {
  type: string
  label: string

  constructor(options: EntityStateOptions) {
    super()
    if (!options.type) throw "Entity state requires type."
    this.type = options.type
    this.label = options.label
  }
}

export interface EntityStateOptions {
  type: string
  label?: string
}

export {TickInfo}
