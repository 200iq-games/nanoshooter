
import {HemisphericLight, FreeCamera, Mesh, Vector3, Color4, ShadowGenerator, SpotLight, DirectionalLight} from "babylonjs"

import {loadBabylonFile} from "monarch-engine/o/Susa"
import {StateEntry, Message} from "monarch-engine/o/Network"
import {Entity, LogicInput, LogicOutput} from "monarch-engine/o/Entity"

import {NanoshooterEntity} from "./Nanoshooter"

export interface EnvironmentEntry extends StateEntry {
  type: "Environment"
  babylonFile: string
}

export default class Environment extends NanoshooterEntity<EnvironmentEntry> {
  private initialized = false

  async setup(entry: EnvironmentEntry) {
    const {host, scene, canvas} = this.context

    await loadBabylonFile(scene, entry.babylonFile || "art/arena/arena.babylon")

    const plane = <Mesh> scene.getMeshByName("Plane")
    const camera = <FreeCamera> scene.getCameraByName("Camera")
    const light = <DirectionalLight> scene.getLightByName("Sun")

    if (camera) {
      scene.activeCamera = camera
      camera.speed = 0.25
    }
    else throw new Error(`camera "Camera" not found`)

    const shadowGenerator = new ShadowGenerator(1024, light)
    shadowGenerator.bias = 0.001
    const shadowCasters: Mesh[] = [plane]
    const shadowReceivers: Mesh[] = [plane]
    shadowGenerator.getShadowMap().renderList.push(...shadowCasters)
    for (const receiver of shadowReceivers) receiver.receiveShadows = true
  }

  logic({entry}) {

    if (!this.initialized) {
      this.initialized = true
      this.setup(entry)
    }

    return null
  }
}
