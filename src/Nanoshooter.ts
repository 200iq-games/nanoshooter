
import Game, {GameOptions} from "./Engine/Game"
import Stage from "./Engine/Stage"
import {EntityState} from "./Engine/Entity"

/**
 * Nanoshooter game.
 * Subclass of Game, which has start/stop methods, etc.
 */
export default class Nanoshooter extends Game {

  initialize() {
    super.initialize()
    const {canvas, scene} = this.stage

    // Physics.
    const gravity = new BABYLON.Vector3(0, -9.81, 0)
    scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin())

    // Background color.
    scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8)

    // Lights.
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 20, 0), scene)
    light.intensity = 0.8

    // Camera.
    const camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 40, -2), scene)
    camera.setTarget(BABYLON.Vector3.Zero())
    camera.attachControl(canvas, false)

    // Action!
    this.createInitialEntities()
  }

  createInitialEntities() {

    // Floor.
    this.addEntity(new EntityState({
      type: "Nanoshooter/Entities/Floor",
      label: "FancyFloor"
    }))

    // Spawner.
    this.addEntity(new EntityState({
      type: "Nanoshooter/Entities/Spawner",
      label: "Spawnlord"
    }))

    // Robot.
    this.addEntity(new EntityState({
      type: "Nanoshooter/Entities/Robot",
      label: "Robot"
    }))

    // // Cube.
    // this.addEntity(new EntityState({
    //     type: "Nanoshooter/Entities/Cube",
    //     label: "FancyCube"
    // }))
  }
}
