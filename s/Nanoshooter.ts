
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

export abstract class NanoshooterEntity extends Entity<NanoshooterContext> {}

export interface NanoshooterOptions {
  state: State
  window: Window
  canvas: HTMLCanvasElement
  entityClasses: EntityClasses
}

export default class Nanoshooter extends ServiceMaster {
  constructor({window, canvas, state, entityClasses}) {

    // make susa
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    const susa = new Susa({window, canvas, engine, scene})

    // make monarch, with susa registered as a service
    const context: NanoshooterContext = {host: true, scene, canvas}
    const ticker = new Ticker()
    const network = new LoopbackNetwork({context, state})
    const simulator = new Simulator({context, entityClasses})
    const monarch = new Monarch({ticker, network, simulator, services: [susa]})

    // monarch is a service of this game
    super([monarch])
  }
}
