
import {Engine, Scene} from "babylonjs"

import Susa from "monarch-engine/o/Susa"
import Ticker from "monarch-engine/o/Ticker"
import Monarch, {Context, LoopbackNetwork, StateEntry, State, Message, Entity, GenericEntity, EntityClasses} from "monarch-engine"

export interface NanoshooterContext extends Context {
  host: boolean
  scene: Scene
  canvas: HTMLCanvasElement
}

export interface NanoshooterOptions {
  state: State
  window: Window
  canvas: HTMLCanvasElement
  entityClasses: EntityClasses
}

export default class Nanoshooter {
  readonly monarch: Monarch
  readonly susa: Susa
  constructor({window, canvas, entityClasses}) {
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    const context = {host: true, scene, canvas}
    this.monarch = new Monarch(context, entityClasses)
    this.susa = new Susa({window, canvas, engine, scene})
  }
}
