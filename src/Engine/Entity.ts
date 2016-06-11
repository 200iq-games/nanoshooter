
import Game from "./Game"
import World from "./World"
import Stage from "./Stage"
import State from "./State"
import {TickInfo} from "./Ticker"

/**
 * Entity in the game world which responds to fresh entity state on logic ticks.
 * An entity doesn't actually need to persist any state, fresh state can just pass through the logic method.
 */
export default class Entity {

  /** Module ID for this entity class. Used to load entity classes on-the-fly. */
  static type: string = "Nanoshooter/Entities/Entity"

  /** Unique ID tag for this entity instance. */
  tag: string

  /** Human-friendly nickname for this entity instance. Doesn't have to be unique. Useful for entity queries. */
  label: string

  /** Parent game instance. */
  protected game: Game

  /** Parent world instance. */
  protected stage: Stage

  /**
   * Create a new entity instance.
   * You can optionally provide your own label for each instance.
   */
  constructor(options: EntityOptions) {
    this.tag = options.tag
    this.label = options.label || ""
    this.game = options.game
    this.stage = options.stage

    this.initialize()
  }

  /**
   * Initialize this entity.
   */
  protected initialize() {}

  /**
   * Respond to fresh entity state on a logic tick.
   */
  logic(state: EntityState, tickInfo: TickInfo): { stateDelta: any } { return undefined }

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

export interface EntityOptions {
  tag: string
  label?: string
  game: Game
  stage: Stage
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
