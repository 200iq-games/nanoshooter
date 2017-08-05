
import {Engine, Scene} from "babylonjs"

import Susa from "monarch-engine/o/Susa"
import Ticker from "monarch-engine/o/Ticker"
import Monarch, {Context, State, StateEntry, EntityClasses} from "monarch-engine"

export interface NanoshooterContext {
  host: boolean
  window: Window
  scene: Scene
  canvas: HTMLCanvasElement
  addEntry: (entry: StateEntry) => void
  removeEntry: (id: string) => void
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
    const context = {
      host: true,
      window,
      scene,
      canvas,
      addEntry: entry => this.monarch.addEntry(entry),
      removeEntry: id => this.monarch.removeEntry(id)
    }
    this.monarch = new Monarch({context, entityClasses})
    this.susa = new Susa({window, canvas, engine, scene})
  }
}
