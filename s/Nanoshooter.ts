
import {Engine, Scene} from "babylonjs"

import Susa from "monarch-engine/o/Susa"
import Ticker from "monarch-engine/o/Ticker"
import Simulator from "monarch-engine/o/Simulator"
import Monarch, {Context} from "monarch-engine/o/Monarch"
import {Service, ServiceMaster} from "monarch-engine/o/toolbox"
import {LoopbackNetwork, StateEntry, State, Message} from "monarch-engine/o/Network"
import {Entity, GenericEntity, EntityClasses, LogicInput, LogicOutput} from "monarch-engine/o/Entity"

export interface NanoshooterContext extends Context {
  scene: Scene
  canvas: HTMLCanvasElement
}

export abstract class NanoshooterEntity<gStateEntry extends StateEntry = StateEntry, gMessage extends Message = Message> extends Entity<NanoshooterContext, gStateEntry, gMessage> {}

export interface NanoshooterOptions {
  state: State
  window: Window
  canvas: HTMLCanvasElement
  entityClasses: EntityClasses
}

export default class Nanoshooter extends ServiceMaster {

  constructor({state, window, canvas, entityClasses}) {
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    const susa = new Susa({window, canvas, engine, scene})

    const context: NanoshooterContext = {host: true, scene, canvas}
    const monarch = new Monarch(Monarch.createStandardOptions({context, entityClasses, state}))

    super([monarch, susa])
  }
}
