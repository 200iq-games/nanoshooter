
import {Mesh, Vector3} from "babylonjs"
import {Entity, StateEntry} from "monarch-engine"
import {loadBabylonFile} from "monarch-engine/o/susa"

import {NanoshooterContext} from "../Nanoshooter"

export interface TankEntry extends StateEntry {
  type: "Tank"
  babylonFile: string
  position: [number, number, number]
}

export default class Tank extends Entity<NanoshooterContext, TankEntry> {
  context: NanoshooterContext

  constructor(o) {
    super(o)
    this.setup()
  }

  private async setup() {
    const {scene} = this.context
    const result = await loadBabylonFile(scene, this.entry.babylonFile)
    const chassis = <Mesh> scene.getMeshByName("Chassis")
    const turret = <Mesh> scene.getMeshByName("Turret")
    const position = Vector3.FromArray(this.entry.position)
    chassis.position.addInPlace(position)
    turret.position.addInPlace(position)
  }

  destructor() {}
}
